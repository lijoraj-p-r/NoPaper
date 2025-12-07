import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import Footer from "../components/Footer";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("add-book");
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    pdf_url: "",
    cover_url: "",
  });
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const { isDark, toggleTheme } = useTheme();
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const email = auth.email || localStorage.getItem("email");
  const password = localStorage.getItem("password");

  const fetchBooks = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/books`, {
        headers: { email, password },
      });
      setBooks(res.data);
    } catch (e) {
      console.error("Failed to fetch books:", e);
    }
  }, [email, password]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/orders`, {
        headers: { email, password },
      });
      setOrders(res.data);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    }
  }, [email, password]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats`, {
        headers: { email, password },
      });
      setStats(res.data);
    } catch (e) {
      console.error("Failed to fetch stats:", e);
    }
  }, [email, password]);

  useEffect(() => {
    if (activeTab === "books") {
      fetchBooks();
    } else if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "dashboard") {
      fetchStats();
      fetchOrders();
    }
  }, [activeTab, fetchBooks, fetchOrders, fetchStats]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pdf_url) {
      alert("Please enter a PDF URL");
      return;
    }
    if (!form.pdf_url.startsWith("http://") && !form.pdf_url.startsWith("https://")) {
      alert("Please enter a valid URL (must start with http:// or https://)");
      return;
    }
    setLoading(true);

    try {
      await axios.post(`${API_URL}/admin/books`, {
        title: form.title,
        author: form.author,
        price: parseFloat(form.price),
        description: form.description || null,
        pdf_url: form.pdf_url,
        cover_url: form.cover_url || null,
      }, {
        headers: {
          email,
          password,
          "Content-Type": "application/json",
        },
      });
      alert("Book added successfully!");
      setForm({ title: "", author: "", price: "", description: "", pdf_url: "", cover_url: "" });
      if (activeTab === "books") {
        fetchBooks();
      }
    } catch (e) {
      alert(e.response?.data?.detail || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
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

  const handleDeleteBook = async (bookId, bookTitle, purchaseCount = 0) => {
    let confirmMessage = `Are you sure you want to delete "${bookTitle}"?\n\nThis action cannot be undone.`;
    
    if (purchaseCount > 0) {
      confirmMessage += `\n\nNote: This book has been purchased ${purchaseCount} time(s), but users have already downloaded it, so deletion is safe.`;
    }
    
    const confirmDelete = window.confirm(confirmMessage);
    
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${API_URL}/admin/books/${bookId}`, {
        headers: {
          email,
          password,
        },
      });
      
      if (response.data && response.data.message) {
        alert(response.data.message);
      } else {
        alert("Book deleted successfully!");
      }
      
      // Refresh the books list
      await fetchBooks();
    } catch (e) {
      const errorMessage = e.response?.data?.detail || e.message || "Failed to delete book";
      console.error("Delete book error:", e);
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className={`admin-page ${isDark ? 'dark' : ''}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDark ? '☀️' : '🌙'}
      </button>
      <div className="admin-wrapper">
        <div className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/favicon.ico" alt="NoPaper Logo" className="logo-icon" />
            <h2>📚 NoPaper</h2>
          </div>
          <p>Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={activeTab === "add-book" ? "active" : ""}
            onClick={() => setActiveTab("add-book")}
          >
            ➕ Add Book
          </button>
          <button
            className={activeTab === "books" ? "active" : ""}
            onClick={() => setActiveTab("books")}
          >
            📖 All Books
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            👥 Purchases
          </button>
        </nav>
        <div className="sidebar-footer">
          <p>Logged in as: {email}</p>
          <button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
        </div>

        <div className="admin-content">
        {activeTab === "dashboard" && (
          <div className="dashboard-tab">
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h3>{stats.total_books || 0}</h3>
                  <p>Total Books</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.total_users || 0}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-info">
                  <h3>{stats.total_orders || 0}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>₹{stats.total_revenue?.toFixed(2) || "0.00"}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
            </div>
            <div className="recent-orders">
              <h2>Recent Purchases</h2>
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>User</th>
                      <th>Books</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.order_id}>
                        <td>#{order.order_id}</td>
                        <td>{order.user_email}</td>
                        <td>
                          {order.books.map((b) => b.title).join(", ")}
                        </td>
                        <td>₹{order.total}</td>
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "add-book" && (
          <div className="add-book-tab">
            <h1>Add New Book</h1>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Book Title *</label>
                <input
                  name="title"
                  placeholder="Enter book title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input
                  name="author"
                  placeholder="Enter author name"
                  value={form.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter book description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>PDF URL *</label>
                <input
                  name="pdf_url"
                  type="url"
                  placeholder="https://example.com/book.pdf"
                  value={form.pdf_url}
                  onChange={handleChange}
                  required
                />
                <p className="help-text">Enter the direct URL to the PDF file</p>
              </div>
              <div className="form-group">
                <label>Cover Image URL (Optional)</label>
                <input
                  name="cover_url"
                  type="url"
                  placeholder="https://example.com/cover.jpg or paste image URL here"
                  value={form.cover_url}
                  onChange={handleChange}
                />
                <p className="help-text">Enter or paste the URL to the book cover image</p>
                {form.cover_url && (
                  <div className="cover-preview">
                    <img src={form.cover_url} alt="Cover preview" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Book"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "books" && (
          <div className="books-tab">
            <h1>All Books</h1>
            <div className="books-grid">
              {books.map((book) => (
                <div key={book.id} className="book-card-admin">
                  {book.cover_url && (
                    <div className="book-cover-admin">
                      <img src={book.cover_url} alt={`${book.title} cover`} onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                  <div className="book-header-admin">
                    <div>
                      <h3>{book.title}</h3>
                      <p className="author">by {book.author}</p>
                    </div>
                    <button
                      className="delete-book-btn"
                      onClick={() => handleDeleteBook(book.id, book.title, book.purchase_count || 0)}
                      title="Delete book (safe even if purchased - users have downloaded it)"
                    >
                      🗑️
                    </button>
                  </div>
                  {book.description && (
                    <div className="description-wrapper">
                      <p className={`description ${expandedDescriptions.has(book.id) ? 'expanded' : ''}`}>
                        {book.description}
                      </p>
                      {book.description && book.description.length > 100 && (
                        <button
                          className="read-more-btn"
                          onClick={() => toggleDescription(book.id)}
                        >
                          {expandedDescriptions.has(book.id) ? 'Read less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  )}
                  <div className="book-footer">
                    <span className="price">₹{book.price}</span>
                    <span className="purchases">
                      {book.purchase_count} purchases
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-tab">
            <h1>All Purchases</h1>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User Email</th>
                    <th>Books Purchased</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Purchase Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_id}>
                      <td>#{order.order_id}</td>
                      <td>{order.user_email}</td>
                      <td>
                        <div className="books-list">
                          {order.books.map((book, idx) => (
                            <span key={idx} className="book-tag">
                              {book.title}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>₹{order.total}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <p className="no-data">No purchases yet</p>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
