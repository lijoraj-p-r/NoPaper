import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useTheme } from "../ThemeContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("add-book");
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
  });
  const [pdf, setPdf] = useState(null);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  useEffect(() => {
    if (activeTab === "books") {
      fetchBooks();
    } else if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "dashboard") {
      fetchStats();
      fetchOrders();
    }
  }, [activeTab]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/books`, {
        headers: { email, password },
      });
      setBooks(res.data);
    } catch (e) {
      console.error("Failed to fetch books:", e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/orders`, {
        headers: { email, password },
      });
      setOrders(res.data);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats`, {
        headers: { email, password },
      });
      setStats(res.data);
    } catch (e) {
      console.error("Failed to fetch stats:", e);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdf) {
      alert("Please select a PDF file");
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("title", form.title);
    data.append("author", form.author);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("pdf", pdf);

    try {
      await axios.post(`${API_URL}/admin/books`, data, {
        headers: {
          email,
          password,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Book uploaded successfully!");
      setForm({ title: "", author: "", price: "", description: "" });
      setPdf(null);
      if (activeTab === "books") {
        fetchBooks();
      }
    } catch (e) {
      alert(e.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={`admin-page ${isDark ? 'dark' : ''}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDark ? '☀️' : '🌙'}
      </button>
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>📚 NoPaper</h2>
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
              localStorage.clear();
              window.location.href = "/login";
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
                <label>PDF File *</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdf(e.target.files[0])}
                  required
                />
                {pdf && <p className="file-name">Selected: {pdf.name}</p>}
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload Book"}
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
                  <h3>{book.title}</h3>
                  <p className="author">by {book.author}</p>
                  <p className="description">{book.description}</p>
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
  );
}

export default AdminDashboard;
