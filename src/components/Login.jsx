import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {useAuth } from '../context/AuthContext';
import '../index.css'
const api = axios.create({
  baseURL: "https://backendapi-9196.onrender.com"
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        email: loginInfo.email,
        password: loginInfo.password
      });
      const { jwtToken } = response.data;

      if (jwtToken) {
        login(jwtToken); // Update login state in context
        toast.success("Login success");
        navigate("/");
      } else {
        toast.error("Login failed, please try again");
      }
    } catch (error) {
      toast.error("Invalid credentials");
      console.error("Login error", error);
    }
  };

  return (
    <div className="container wrapper d-flex align-items-center justify-content-center">
      <form className="form_wrapper shadow px-3 py-3" onSubmit={handleLogin}>
        <div className="py-1">
          <label className="form-label">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            name="email"
            value={loginInfo.email}
            onChange={handleChange}
          />
        </div>
        <div className="py-1">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            name="password"
            value={loginInfo.password}
            onChange={handleChange}
          />
        </div>
        <div className="d-grid mt-3">
          <button className="btn btn-primary" type="submit">Login</button>
        </div>
        <div className="mt-2 d-flex justify-content-center align-items-center">
          <p>New user? <NavLink to="/register">Register Here</NavLink></p>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-2">
          <button className="btn btn-primary">Login with Google</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
