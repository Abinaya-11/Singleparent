import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';

// 👇 Import the Google OAuth Provider
import { GoogleOAuthProvider } from '@react-oauth/google';

// ✅ Replace this with your actual client ID from Google Cloud Console
const clientId = "YOUR_GOOGLE_CLIENT_ID";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
