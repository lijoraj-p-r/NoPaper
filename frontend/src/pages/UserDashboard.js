import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./UserDashboard.css";

function UserDashboard() {
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${API_URL}/books`).then((res) => setBooks(res.data));
  }, []);

  const handleBuy = async (id) => {
    try {
      await axios.post(
        `${API_URL}/buy`,
        { book_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Purchase successful! You can download the book now.");
    } catch (e) {
      alert(e.response?.data?.detail || "Purchase failed");
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/books/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
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
              <button onClick={() => handleBuy(b.id)}>Buy</button>
              <button onClick={() => handleDownload(b.id)}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;


