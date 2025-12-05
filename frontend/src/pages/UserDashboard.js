import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./UserDashboard.css";

function UserDashboard() {
  const [books, setBooks] = useState([]);
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  useEffect(() => {
    axios.get(`${API_URL}/books`).then((res) => setBooks(res.data));
  }, []);

  const handleBuy = async (bookId, bookPrice, bookTitle) => {
    try {
      // Create order and get UPI payment URL
      const response = await axios.post(
        `${API_URL}/buy`,
        { book_id: bookId },
        {
          headers: {
            email: email,
            password: password,
          },
        }
      );

      const { upi_url, upi_id, order_id, amount } = response.data;

      // Show payment confirmation
      const confirmed = window.confirm(
        `Pay ₹${amount} to ${upi_id}?\n\nOrder ID: ${order_id}\nBook: ${bookTitle}\n\nClick OK to open UPI payment.`
      );

      if (confirmed) {
        // Open UPI payment
        window.open(upi_url, '_blank');
        
        // Wait a bit then ask for payment confirmation
        setTimeout(() => {
          const paymentStatus = window.confirm(
            `Did you complete the payment?\n\nOrder ID: ${order_id}\nAmount: ₹${amount}\n\nClick OK if payment was successful.`
          );

          if (paymentStatus) {
            // Verify payment
            verifyPayment(order_id);
          } else {
            alert("Payment cancelled. Order is pending.");
          }
        }, 2000);
      }
    } catch (e) {
      const errorMsg = e.response?.data?.detail || "Purchase failed";
      alert(`Error: ${errorMsg}`);
    }
  };

  const verifyPayment = async (orderId) => {
    try {
      const response = await axios.post(
        `${API_URL}/payment/verify?order_id=${orderId}&status=success`,
        {},
        {
          headers: {
            email: email,
            password: password,
          },
        }
      );

      if (response.data.status === "paid") {
        alert(`Payment successful!\nOrder ID: ${orderId}\nYou can now download the book.`);
        // Refresh books list
        window.location.reload();
      }
    } catch (e) {
      alert("Payment verification failed. Please contact support.");
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/books/${id}/download`, {
        headers: {
          email: email,
          password: password,
        },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "book.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert(e.response?.data?.detail || "Download not allowed");
    }
  };

  return (
    <div className="user-page">
      <header className="top-bar">
        <h2>Book Store - User</h2>
      </header>
      <div className="book-grid">
        {books.map((b) => (
          <div key={b.id} className="book-card">
            <h3>{b.title}</h3>
            <p className="author">{b.author}</p>
            <p className="description">{b.description}</p>
            <p className="price">${b.price}</p>
            <div className="actions">
              <button onClick={() => handleBuy(b.id, b.price, b.title)}>Buy</button>
              <button onClick={() => handleDownload(b.id)}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;


