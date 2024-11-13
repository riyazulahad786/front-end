import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';

ReactDOM.render(
  <AuthProvider>
   <ToastContainer/>  
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
