#!/usr/bin/env python3
"""
Script to add an admin user to the NoPaper database
Run this script to generate the password hash and optionally add the user
"""

from passlib.context import CryptContext
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import sys

# Database configuration (same as backend/db.py)
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "lijo")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DB", "online_bookshop")

DB_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_password_hash(password: str) -> str:
    """Generate bcrypt hash for password"""
    if len(password) < 7:
        raise ValueError("Password must be at least 7 characters long")
    if len(password.encode('utf-8')) > 72:
        raise ValueError("Password cannot be longer than 72 bytes")
    return pwd_context.hash(password)

def add_admin_user(email: str, password: str, add_to_db: bool = False):
    """Generate password hash and optionally add admin user to database"""
    
    # Generate password hash
    password_hash = generate_password_hash(password)
    
    print("=" * 60)
    print("Admin User Setup")
    print("=" * 60)
    print(f"Email: {email}")
    print(f"Password: {'*' * len(password)}")
    print(f"Role: admin")
    print()
    print("Password Hash (bcrypt):")
    print(password_hash)
    print()
    
    # SQL Query
    print("=" * 60)
    print("SQL Query to Add Admin User:")
    print("=" * 60)
    print()
    print("INSERT INTO users (email, password_hash, role, created_at)")
    print("VALUES (")
    print(f"    '{email}',")
    print(f"    '{password_hash}',")
    print("    'admin',")
    print("    NOW()")
    print(");")
    print()
    
    if add_to_db:
        try:
            from models import User, Base
            
            engine = create_engine(DB_URL, pool_pre_ping=True)
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            
            # Check if user already exists
            db = SessionLocal()
            existing = db.query(User).filter(User.email == email).first()
            
            if existing:
                if existing.role == 'admin':
                    print(f"⚠ User {email} already exists and is already an admin!")
                else:
                    # Update to admin
                    existing.role = 'admin'
                    existing.password_hash = password_hash
                    db.commit()
                    print(f"✓ Updated user {email} to admin role")
            else:
                # Create new admin user
                admin_user = User(
                    email=email,
                    password_hash=password_hash,
                    role='admin'
                )
                db.add(admin_user)
                db.commit()
                db.refresh(admin_user)
                print(f"✓ Admin user {email} created successfully!")
                print(f"  User ID: {admin_user.id}")
            
            db.close()
            
        except Exception as e:
            print(f"✗ Error adding user to database: {str(e)}")
            print("\nYou can manually run the SQL query above instead.")
            sys.exit(1)
    else:
        print("=" * 60)
        print("To add this user to the database:")
        print("1. Copy the SQL query above")
        print("2. Run it in MySQL command line or MySQL Workbench")
        print("3. Or run this script with --add flag:")
        print(f"   python add-admin-user.py --email {email} --password YOUR_PASSWORD --add")
        print("=" * 60)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Add admin user to NoPaper database')
    parser.add_argument('--email', type=str, default='admin@nopaper.com', help='Admin email address')
    parser.add_argument('--password', type=str, required=True, help='Admin password (min 7 chars)')
    parser.add_argument('--add', action='store_true', help='Add user directly to database')
    
    args = parser.parse_args()
    
    try:
        add_admin_user(args.email, args.password, args.add)
    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)

