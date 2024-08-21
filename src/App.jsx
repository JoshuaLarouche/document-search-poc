import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import SearchPage from "./SearchPage";
import UploadPage from "./UploadPage";
import Header from "./Header";
import { Layout } from "antd";
import './global.css'; // Import your global CSS here

const { Header: AntHeader, Content } = Layout;

const App = () => {
  const navigate = useNavigate();

  const renderHeader = () => {
    const path = window.location.pathname;
    if (path === "/upload") {
      return <Header title="Document Upload" buttonText="Back to Search" buttonAction={() => navigate("/")} />;
    }
    return <Header title="Document Search Minimum Viable Product" buttonText="Upload" buttonAction={() => navigate("/upload")} />;
  };

  return (
    <Layout className="app">
      {renderHeader()}
      <Content style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
