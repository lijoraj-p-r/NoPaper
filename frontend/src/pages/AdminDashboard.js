import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
  });
  const [pdf, setPdf] = useState(null);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdf) {
      alert("Please select a PDF file");
      return;
    }
    const data = new FormData();
    data.append("title", form.title);
    data.append("author", form.author);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("pdf", pdf);

    try {
      await axios.post(`${API_URL}/admin/books`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Book uploaded successfully");
      setForm({ title: "", author: "", price: "", description: "" });
      setPdf(null);
    } catch (e) {
      alert(e.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div className="admin-page">
      <header className="top-bar">
        <h2>Admin Dashboard</h2>
      </header>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files[0])}
          required
        />
        <button type="submit">Upload Book PDF</button>
      </form>
    </div>
  );
}

export default AdminDashboard;


