import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      style={{
        background: "#007bff",
        color: "white",
        padding: "10px 20px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
          🎓 Student Predictor
        </h1>

        {/* Desktop Links */}
        <div className="nav-links" style={{ display: isOpen ? "block" : "flex", gap: "15px" }}>
          <Link style={{ color: "white", textDecoration: "none" }} to="/">
            Home
          </Link>
          {/*<Link style={{ color: "white", textDecoration: "none" }} to="/analysis">
            Analysis
          </Link>*/}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "22px",
            cursor: "pointer",
            display: "none",
          }}
          className="menu-btn"
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <Link style={{ color: "white", textDecoration: "none" }} to="/">
            Prediction
          </Link>
          <Link style={{ color: "white", textDecoration: "none" }} to="/analysis">
            Analysis
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .nav-links {
            display: none !important;
          }
          .menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}

