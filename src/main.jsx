import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx'
import 'antd/dist/reset.css'; // Import Ant Design styles
import typography from './Typography.jsx';
import './global.css'; // Import your global CSS here

typography.injectStyles();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
   </Router>,
  </React.StrictMode>,
)
