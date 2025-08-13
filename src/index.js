import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18+ import
import './index.css'; // Import your global styles
import App from './App'; // Import your main App component

// Access the root element from the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root element, wrapped in StrictMode for additional checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
