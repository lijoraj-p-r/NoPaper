from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr, Field
try:
    from pydantic import field_validator
except ImportError:
    # Fallback for older Pydantic versions
    from pydantic import validator as field_validator
from typing import List, Optional
import os

# Import handling for both package and direct execution
import sys
from pathlib import Path
backend_path = Path(__file__).parent
if str(backend_path) not in sys.path:
    sys.path.insert(0, str(backend_path))

from db import get_db, engine
from models import Base, User, Book, Order, OrderItem


Base.metadata.create_all(bind=engine)

SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_ME_TO_A_RANDOM_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Password encryption removed - storing passwords as plain text

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads", "pdfs")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Online Book Shop API")

# CORS configuration - allow multiple origins
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=7, description="Password must be at least 7 characters")
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 7:
            raise ValueError('Password must be at least 7 characters long')
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class BookOut(BaseModel):
    id: int
    title: str
    author: str
    price: float
    description: Optional[str] = None

    class Config:
        from_attributes = True


class BuyRequest(BaseModel):
    book_id: int


def get_password_hash(password: str) -> str:
    # No encryption - return password as-is
    return password


def verify_password(plain_password: str, stored_password: str) -> bool:
    # No encryption - direct comparison
    return plain_password == stored_password


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    token = authorization.split(" ", 1)[1]
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise credentials_exception
    return user


def require_admin(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admins only")
    return user


@app.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    access_token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}


@app.post("/login", response_model=Token)
def login(login_req: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == login_req.email).first()
        if not user or not verify_password(login_req.password, user.password_hash):
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        access_token = create_access_token({"sub": user.id, "role": user.role})
        return {"access_token": access_token, "token_type": "bearer", "role": user.role}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@app.get("/books", response_model=List[BookOut])
def list_books(db: Session = Depends(get_db)):
    return db.query(Book).all()


@app.post("/admin/books", dependencies=[Depends(require_admin)])
async def upload_book(
    title: str,
    author: str,
    price: float,
    description: Optional[str] = None,
    pdf: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not pdf.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    safe_name = f"{int(datetime.utcnow().timestamp())}_{pdf.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    with open(file_path, "wb") as f:
        content = await pdf.read()
        f.write(content)

    book = Book(
        title=title,
        author=author,
        price=price,
        description=description,
        pdf_path=file_path,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return {"id": book.id, "message": "Book uploaded"}


@app.post("/buy")
def buy_book(
    req: BuyRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = db.query(Book).filter(Book.id == req.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    order = Order(user_id=user.id, total=book.price, status="paid")
    db.add(order)
    db.commit()
    db.refresh(order)

    item = OrderItem(
        order_id=order.id,
        book_id=book.id,
        quantity=1,
        price_each=book.price,
    )
    db.add(item)
    db.commit()

    return {"message": "Purchase successful", "order_id": order.id}


def user_has_book(db: Session, user_id: int, book_id: int) -> bool:
    q = (
        db.query(OrderItem)
        .join(Order, OrderItem.order_id == Order.id)
        .filter(Order.user_id == user_id, OrderItem.book_id == book_id, Order.status == "paid")
    )
    return db.query(q.exists()).scalar()


@app.get("/books/{book_id}/download")
def download_book(
    book_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if not user_has_book(db, user.id, book_id):
        raise HTTPException(
            status_code=403,
            detail="You must buy this book to download it",
        )

    return FileResponse(
        book.pdf_path,
        media_type="application/pdf",
        filename=os.path.basename(book.pdf_path),
    )


@app.get("/")
def root():
    return {"message": "Online Book Shop API running"}


