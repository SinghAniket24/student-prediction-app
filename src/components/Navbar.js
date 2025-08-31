import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#007bff", color: "white" }}>
      <Link style={{ margin: "0 10px", color: "white" }} to="/">Prediction</Link>
      <Link style={{ margin: "0 10px", color: "white" }} to="/analysis">Analysis</Link>
    </nav>
  );
}
