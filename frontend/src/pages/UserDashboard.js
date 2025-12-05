import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import PaymentModal from "../components/PaymentModal";
import Footer from "../components/Footer";
import "./UserDashboard.css";

function UserDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(null);
  const { isDark, toggleTheme } = useTheme();
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = auth.isAuthenticated;
  const email = auth.email || localStorage.getItem("email");
  const password = localStorage.getItem("password");

  const fetchBooks = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/books`);
      setBooks(res.data);
    } catch (e) {
      console.error("Failed to fetch books:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleBuy = async (bookId, bookPrice, bookTitle) => {
    // Check if user is logged in
    if (!isAuthenticated || !email || !password) {
      const shouldLogin = window.confirm(
        "You need to login to purchase books. Would you like to login now?"
      );
      if (shouldLogin) {
        navigate("/login");
      }
      return;
    }

    try {
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
      
      setPaymentModal({
        orderId: order_id,
        amount: amount,
        upiId: upi_id,
        upiUrl: upi_url,
        bookTitle: bookTitle,
      });
    } catch (e) {
      const errorMsg = e.response?.data?.detail || "Purchase failed";
      alert(`Error: ${errorMsg}`);
    }
  };

  const handlePaymentComplete = async () => {
    if (!paymentModal) return;
    
    try {
      const response = await axios.post(
        `${API_URL}/payment/verify?order_id=${paymentModal.orderId}&status=success`,
        {},
        {
          headers: {
            email: email,
            password: password,
          },
        }
      );

      if (response.data.status === "paid") {
        alert(`Payment successful! Order #${paymentModal.orderId}\nYou can now download the book.`);
        fetchBooks();
      }
    } catch (e) {
      alert("Payment verification failed. Please contact support.");
    }
  };

  const handleDownload = async (id) => {
    // Check if user is logged in
    if (!isAuthenticated || !email || !password) {
      const shouldLogin = window.confirm(
        "You need to login to download books. Would you like to login now?"
      );
      if (shouldLogin) {
        navigate("/login");
      }
      return;
    }

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
      alert(e.response?.data?.detail || "Download not allowed. Please purchase the book first.");
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate("/user", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className={`user-page ${isDark ? 'dark' : ''}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDark ? '☀️' : '🌙'}
      </button>
      
      <header className="top-bar">
        <div>
          <h2>📚 NoPaper Books</h2>
          {isAuthenticated && email ? (
            <p className="user-email">{email}</p>
          ) : (
            <p className="user-email">Welcome! Please login to purchase books.</p>
          )}
        </div>
        <div className="header-actions">
          <Link to="/about" className="about-link">About Us</Link>
          <button 
            className={isAuthenticated ? "logout-button" : "login-button"} 
            onClick={handleAuthAction}
          >
            {isAuthenticated ? "Logout" : "Login"}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h3>No books available</h3>
          <p>Check back later for new books!</p>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((b) => (
            <div key={b.id} className="book-card">
              <div className="book-header">
                <h3>{b.title}</h3>
                <p className="author">by {b.author}</p>
              </div>
              {b.description && (
                <p className="description">{b.description}</p>
              )}
              <div className="book-footer">
                <span className="price">₹{b.price}</span>
                <div className="actions">
                  <button 
                    className="btn-buy" 
                    onClick={() => handleBuy(b.id, b.price, b.title)}
                  >
                    Buy Now
                  </button>
                  <button 
                    className="btn-download" 
                    onClick={() => handleDownload(b.id)}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {paymentModal && (
        <PaymentModal
          isOpen={!!paymentModal}
          onClose={() => setPaymentModal(null)}
          orderId={paymentModal.orderId}
          amount={paymentModal.amount}
          upiId={paymentModal.upiId}
          upiUrl={paymentModal.upiUrl}
          bookTitle={paymentModal.bookTitle}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      <Footer />
    </div>
  );
}

export default UserDashboard;
