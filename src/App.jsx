import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import SearchPage from "./SearchPage";
import UploadPage from "./UploadPage";
import "./App.css";
import logo from './assets/BCID_H_rgb_pos.png';

const Header = () => {
  const location = useLocation();

  if (location.pathname === "/upload") {
    return null; // No header for the upload page
  }

  return (
    <div className="header">
      <img src={logo} alt="Logo" className="header-logo" />
      <h1>Document Search Minimum Viable Product</h1>
      <button onClick={() => window.location.href = "/upload"} className="upload-button">Upload</button>
    </div>
  );
};

const App = () => (
  <Router>
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </div>
  </Router>
);

export default App;
