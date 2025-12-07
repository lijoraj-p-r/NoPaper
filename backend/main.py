from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
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

# File upload removed - using URLs instead

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


@app.get("/books")
def list_books(
    email: Optional[str] = Header(default=None, description="User email (optional)"),
    password: Optional[str] = Header(default=None, description="User password (optional)"),
    db: Session = Depends(get_db),
):
    """Get all books, optionally with purchase status for authenticated users"""
    books = db.query(Book).all()
    
    # Check if user is authenticated
    user = None
    if email and password:
        user = db.query(User).filter(User.email == email).first()
        if user and not verify_password(password, user.password_hash):
            user = None
    
    result = []
    for book in books:
        book_data = {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "price": float(book.price),
            "description": book.description,
            "pdf_url": book.pdf_path,  # pdf_path now contains URL
            "cover_url": book.cover_url,  # Cover image URL
            "is_purchased": False,
        }
        
        # Check if user has purchased this book
        if user:
            book_data["is_purchased"] = user_has_book(db, user.id, book.id)
        
        result.append(book_data)
    
    return result


class BookCreate(BaseModel):
    title: str
    author: str
    price: float
    description: Optional[str] = None
    pdf_url: str = Field(..., description="URL to the PDF file")
    cover_url: Optional[str] = Field(None, description="URL to the cover image (optional)")


@app.post("/admin/books")
def create_book(
    book_data: BookCreate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Create a new book with PDF URL"""
    # Validate URL format
    if not book_data.pdf_url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="PDF URL must be a valid HTTP/HTTPS URL")
    
    # Optional: Validate that URL ends with .pdf (can be removed if URLs don't have extensions)
    # if not book_data.pdf_url.lower().endswith(".pdf"):
    #     raise HTTPException(status_code=400, detail="URL should point to a PDF file")

    # Validate cover URL if provided
    if book_data.cover_url and not book_data.cover_url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="Cover image URL must be a valid HTTP/HTTPS URL")
    
    book = Book(
        title=book_data.title,
        author=book_data.author,
        price=book_data.price,
        description=book_data.description,
        pdf_path=book_data.pdf_url,  # Using pdf_path field to store URL
        cover_url=book_data.cover_url,  # Store cover image URL
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return {"id": book.id, "message": "Book created successfully"}


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
    """Redirect to PDF URL if user has purchased the book"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if not user_has_book(db, user.id, book_id):
        raise HTTPException(
            status_code=403,
            detail="You must buy this book to download it",
        )

    # pdf_path now contains the URL
    return RedirectResponse(url=book.pdf_path)


@app.get("/admin/orders")
def get_all_orders(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get all orders with user and book details"""
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    result = []
    for order in orders:
        user = db.query(User).filter(User.id == order.user_id).first()
        order_items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        books = []
        for item in order_items:
            book = db.query(Book).filter(Book.id == item.book_id).first()
            if book:
                books.append({
                    "id": book.id,
                    "title": book.title,
                    "author": book.author,
                    "price": float(item.price_each),
                })
        result.append({
            "order_id": order.id,
            "user_email": user.email if user else "Unknown",
            "user_id": user.id if user else None,
            "total": float(order.total),
            "status": order.status,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "books": books,
        })
    return result


@app.get("/admin/books")
def get_all_books_admin(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get all books with purchase statistics"""
    books = db.query(Book).all()
    result = []
    for book in books:
        # Count purchases
        purchase_count = (
            db.query(OrderItem)
            .join(Order, OrderItem.order_id == Order.id)
            .filter(OrderItem.book_id == book.id, Order.status == "paid")
            .count()
        )
        result.append({
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "price": float(book.price),
            "description": book.description,
            "cover_url": book.cover_url,
            "purchase_count": purchase_count,
            "created_at": book.created_at.isoformat() if book.created_at else None,
        })
    return result


@app.delete("/admin/books/{book_id}")
def delete_book(
    book_id: int,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Delete a book (admin only)
    
    Note: Books can be deleted even if they have been purchased.
    Users who purchased the book have already downloaded it, so deletion is safe.
    """
    try:
        book = db.query(Book).filter(Book.id == book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        
        # Check if book has been purchased (for informational purposes only)
        purchase_count = (
            db.query(OrderItem)
            .join(Order, OrderItem.order_id == Order.id)
            .filter(OrderItem.book_id == book.id, Order.status == "paid")
            .count()
        )
        
        # Delete all order items associated with this book first (to avoid foreign key constraint)
        # This is safe because users have already downloaded the book
        # Use bulk delete for better performance
        try:
            deleted_items = db.query(OrderItem).filter(OrderItem.book_id == book_id).delete(synchronize_session=False)
            # Flush to ensure deletions are processed before deleting the book
            db.flush()
        except Exception as delete_items_error:
            # If bulk delete fails, try individual deletion
            print(f"Bulk delete failed, trying individual deletion: {delete_items_error}")
            order_items = db.query(OrderItem).filter(OrderItem.book_id == book_id).all()
            deleted_items = 0
            for item in order_items:
                try:
                    db.delete(item)
                    deleted_items += 1
                except Exception as e:
                    print(f"Failed to delete order item {item.id}: {e}")
            db.flush()
        
        # Now delete the book
        db.delete(book)
        db.commit()
        
        message = "Book deleted successfully"
        if purchase_count > 0:
            message += f" (Note: {purchase_count} purchase(s) were associated with this book, but users have already downloaded it)"
        
        return {
            "message": message,
            "book_id": book_id,
            "had_purchases": purchase_count > 0,
            "purchase_count": purchase_count,
            "deleted_order_items": deleted_items
        }
    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        error_msg = str(e)
        # Log the full error for debugging
        print(f"Delete book error: {error_msg}")
        print(f"Error type: {type(e).__name__}")
        
        # Check if it's a foreign key constraint error
        if "foreign key" in error_msg.lower() or "constraint" in error_msg.lower() or "1451" in error_msg or "1452" in error_msg:
            # Try alternative approach: delete using raw SQL with parameterized queries
            try:
                # Use parameterized SQL to safely delete order items and book
                db.execute(text("DELETE FROM order_items WHERE book_id = :book_id"), {"book_id": book_id})
                db.execute(text("DELETE FROM books WHERE id = :book_id"), {"book_id": book_id})
                db.commit()
                return {
                    "message": "Book deleted successfully (using alternative method)",
                    "book_id": book_id,
                    "had_purchases": purchase_count > 0,
                    "purchase_count": purchase_count
                }
            except Exception as sql_error:
                db.rollback()
                raise HTTPException(
                    status_code=400,
                    detail=f"Cannot delete book: Database constraint error. Please ensure all related records are removed. Error: {str(sql_error)}"
                )
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete book: {error_msg}"
        )


@app.get("/admin/stats")
def get_admin_stats(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get admin dashboard statistics"""
    total_books = db.query(Book).count()
    total_users = db.query(User).filter(User.role == "user").count()
    total_orders = db.query(Order).filter(Order.status == "paid").count()
    total_revenue = db.query(Order).filter(Order.status == "paid").all()
    revenue = sum(float(order.total) for order in total_revenue)
    
    return {
        "total_books": total_books,
        "total_users": total_users,
        "total_orders": total_orders,
        "total_revenue": revenue,
    }


@app.get("/")
def root():
    return {"message": "Online Book Shop API running"}


