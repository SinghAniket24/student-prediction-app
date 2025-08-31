import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Prediction from "./pages/Prediction";
import Analysis from "./pages/Analysis";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Prediction />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </Router>
  );
}

export default App;
