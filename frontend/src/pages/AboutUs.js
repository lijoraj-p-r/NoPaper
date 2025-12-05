import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import Footer from "../components/Footer";
import "./AboutUs.css";

function AboutUs() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`about-page ${isDark ? 'dark' : ''}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDark ? '☀️' : '🌙'}
      </button>

      <header className="about-header">
        <button className="back-button" onClick={() => navigate("/user")}>
          ← Back to Books
        </button>
        <h1>📚 About NoPaper Books</h1>
      </header>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            NoPaper Books is a modern digital bookstore dedicated to providing instant access 
            to a curated collection of books. We believe in making knowledge accessible to everyone 
            through our seamless digital platform.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <p>
            Our platform offers a wide range of digital books that you can purchase and download 
            instantly. With secure payment options and easy access, we make reading more convenient 
            than ever before.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose Us</h2>
          <ul>
            <li>Instant digital access to books</li>
            <li>Secure and easy payment options</li>
            <li>Curated collection of quality content</li>
            <li>User-friendly interface</li>
            <li>24/7 availability</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Contact & Support</h2>
          <p>
            Have questions or need assistance? We're here to help! Reach out to us through 
            our support channels or connect with us on social media.
          </p>
          
          <div className="social-links">
            <a 
              href="mailto:lijorajpr321@gmail.com" 
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              📧 Support
            </a>
            <a 
              href="https://www.instagram.com" 
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              📷 Instagram
            </a>
            <a 
              href="https://www.linkedin.com" 
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              💼 LinkedIn
            </a>
            <a 
              href="https://www.twitter.com" 
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              🐦 Twitter
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default AboutUs;

