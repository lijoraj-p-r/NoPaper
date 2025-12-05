from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
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

# Simple authentication - no JWT tokens needed

# Password encryption removed - storing passwords as plain text

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
EMAIL_USER = os.getenv("EMAIL_USER", "lijorajpr321@gmail.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")  # Set via environment variable
ADMIN_EMAIL = "lijorajpr321@gmail.com"
UPI_ID = "lijorajpr321@okaxis"

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


class AuthResponse(BaseModel):
    message: str
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


def get_current_user(
    email: str = Header(..., description="User email"),
    password: str = Header(..., description="User password"),
    db: Session = Depends(get_db),
):
    """Simple authentication using email and password from headers"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return user


def require_admin(
    email: str = Header(..., description="Admin email"),
    password: str = Header(..., description="Admin password"),
    db: Session = Depends(get_db),
):
    """Require admin role - simple authentication"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return user


@app.post("/register", response_model=AuthResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    try:
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
        return {"message": "Registration successful", "role": user.role}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@app.post("/login", response_model=AuthResponse)
def login(login_req: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == login_req.email).first()
        if not user or not verify_password(login_req.password, user.password_hash):
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        return {"message": "Login successful", "role": user.role}
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


@app.post("/admin/books")
async def upload_book(
    title: str,
    author: str,
    price: float,
    description: Optional[str] = None,
    pdf: UploadFile = File(...),
    admin_user: User = Depends(require_admin),
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


def send_payment_email(order_id: int, user_email: str, book_title: str, amount: float, status: str, payment_time: str):
    """Send payment confirmation email"""
    try:
        if not EMAIL_PASSWORD:
            print(f"Email not configured. Payment details: Order {order_id}, Amount: {amount}, Status: {status}")
            return
        
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = ADMIN_EMAIL
        msg['Subject'] = f"Payment {status.upper()} - Order #{order_id}"
        
        body = f"""
Payment Details:
---------------
Order ID: {order_id}
User Email: {user_email}
Book: {book_title}
Amount: ₹{amount}
Status: {status.upper()}
Payment Time: {payment_time}
UPI ID: {UPI_ID}
"""
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Payment email sent for order {order_id}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")


@app.post("/buy")
def buy_book(
    req: BuyRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create order and redirect to UPI payment"""
    book = db.query(Book).filter(Book.id == req.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Create order with pending status
    order = Order(user_id=user.id, total=book.price, status="pending")
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

    # Generate UPI payment URL
    upi_url = f"upi://pay?pa={UPI_ID}&am={float(book.price)}&cu=INR&tn=Book Purchase - Order {order.id}"
    
    return {
        "message": "Redirecting to payment",
        "order_id": order.id,
        "amount": float(book.price),
        "upi_url": upi_url,
        "upi_id": UPI_ID,
        "status": "pending"
    }


@app.post("/payment/verify")
def verify_payment(
    order_id: int,
    status: str = "success",
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Verify payment and update order status"""
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if status.lower() == "success":
        order.status = "paid"
        db.commit()
        
        # Get book details
        order_item = db.query(OrderItem).filter(OrderItem.order_id == order_id).first()
        book = db.query(Book).filter(Book.id == order_item.book_id).first() if order_item else None
        
        # Send payment email
        payment_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        send_payment_email(
            order_id=order_id,
            user_email=user.email,
            book_title=book.title if book else "Unknown",
            amount=float(order.total),
            status="success",
            payment_time=payment_time
        )
        
        return {
            "message": "Payment successful",
            "order_id": order_id,
            "status": "paid"
        }
    else:
        order.status = "failed"
        db.commit()
        return {
            "message": "Payment failed",
            "order_id": order_id,
            "status": "failed"
        }


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


