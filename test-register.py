#!/usr/bin/env python3
"""Test script to check registration endpoint"""
import requests
import json

# Test registration
url = "http://localhost:8000/register"
data = {
    "email": "test@example.com",
    "password": "testpassword123"
}

try:
    print("Testing registration endpoint...")
    print(f"URL: {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    print()
    
    response = requests.post(url, json=data)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("\n✓ Registration successful!")
        result = response.json()
        print(f"Token: {result.get('access_token', 'N/A')[:50]}...")
        print(f"Role: {result.get('role', 'N/A')}")
    else:
        print(f"\n✗ Registration failed!")
        print(f"Error: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("✗ Cannot connect to backend server!")
    print("Make sure the backend is running on http://localhost:8000")
except Exception as e:
    print(f"✗ Error: {str(e)}")

