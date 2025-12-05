import React from "react";
import { useTheme } from "../ThemeContext";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-copyright">
          <p>&copy; {currentYear} NoPaper Books. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

