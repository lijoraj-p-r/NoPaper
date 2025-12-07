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
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const { isDark, toggleTheme } = useTheme();
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = auth.isAuthenticated;
  const email = auth.email || localStorage.getItem("email");
  const password = localStorage.getItem("password");

  const fetchBooks = useCallback(async () => {
    try {
      const headers = {};
      if (isAuthenticated && email && password) {
        headers.email = email;
        headers.password = password;
      }
      const res = await axios.get(`${API_URL}/books`, { headers });
      setBooks(res.data);
    } catch (e) {
      console.error("Failed to fetch books:", e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, email, password]);

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
        setPaymentModal(null);
        // Refresh books to show purchased status
        await fetchBooks();
      }
    } catch (e) {
      alert("Payment verification failed. Please contact support.");
    }
  };

  const handleDownload = async (bookId, pdfUrl, isPurchased) => {
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

    // If not purchased, show error
    if (!isPurchased) {
      alert("Please purchase this book first to download it.");
      return;
    }

    // If purchased, use the PDF URL directly or call the download endpoint
    if (pdfUrl) {
      // Direct URL - open in new tab
      window.open(pdfUrl, "_blank");
    } else {
      // Fallback: use the download endpoint which redirects to the URL
      try {
        // Use fetch to follow redirects
        const response = await fetch(`${API_URL}/books/${bookId}/download`, {
          method: 'GET',
          headers: {
            email: email,
            password: password,
          },
          redirect: 'follow',
        });
        
        if (response.ok) {
          // Get the final URL after redirect
          window.open(response.url, "_blank");
        } else {
          throw new Error('Download failed');
        }
      } catch (e) {
        alert("Failed to get download link. Please try again.");
      }
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

  const toggleDescription = (bookId) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  return (
    <div className={`user-page ${isDark ? 'dark' : ''}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDark ? '☀️' : '🌙'}
      </button>
      
      <header className="top-bar">
        <div className="header-brand">
          <img src="/favicon.ico" alt="NoPaper Logo" className="logo-icon" />
          <div>
            <h2>📚 NoPaper Books</h2>
            {isAuthenticated && email ? (
              <p className="user-email">{email}</p>
            ) : (
              <p className="user-email">Welcome! Please login to purchase books.</p>
            )}
          </div>
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
            <div key={b.id} className={`book-card ${b.is_purchased ? 'purchased' : ''}`}>
              {b.cover_url && (
                <div className="book-cover">
                  <img src={b.cover_url} alt={`${b.title} cover`} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
              <div className="book-header">
                <div>
                  <h3>{b.title}</h3>
                  <p className="author">by {b.author}</p>
                </div>
                {b.is_purchased && (
                  <span className="purchased-badge" title="You own this book">
                    ✓ Purchased
                  </span>
                )}
              </div>
              {b.description && (
                <div className="description-wrapper">
                  <p className={`description ${expandedDescriptions.has(b.id) ? 'expanded' : ''}`}>
                    {b.description}
                  </p>
                  {b.description.length > 100 && (
                    <button
                      className="read-more-btn"
                      onClick={() => toggleDescription(b.id)}
                    >
                      {expandedDescriptions.has(b.id) ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}
              <div className="book-footer">
                <span className="price">₹{b.price}</span>
                <div className="actions">
                  {b.is_purchased ? (
                    <button 
                      className="btn-purchased" 
                      disabled
                    >
                      ✓ Owned
                    </button>
                  ) : (
                    <button 
                      className="btn-buy" 
                      onClick={() => handleBuy(b.id, b.price, b.title)}
                    >
                      Buy Now
                    </button>
                  )}
                  <button 
                    className={`btn-download ${b.is_purchased ? 'btn-download-active' : ''}`}
                    onClick={() => handleDownload(b.id, b.pdf_url, b.is_purchased)}
                    disabled={!b.is_purchased}
                    title={b.is_purchased ? "Click to download" : "Purchase to download"}
                  >
                    {b.is_purchased ? "📥 Download" : "Download"}
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
