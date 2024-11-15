import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Create an axios instance with the base URL
const api = axios.create({
  baseURL: 'https://backend-manager.onrender.com'
});

function Register() {
  const navigate = useNavigate();
  const [signUpinfo, setSignupinfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupinfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate confirm password
    if (signUpinfo.password !== signUpinfo.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true); 

    try {
      const response = await api.post("/auth/signup", {
        firstName: signUpinfo.firstName,
        lastName: signUpinfo.lastName,
        email: signUpinfo.email,
        password: signUpinfo.password
      });
      console.log("Registration successful", response.data);
      toast.success("Registration was successfully");
      navigate('/login');
    
    } catch (error) {
      toast.error("Ops something went wrong");
      console.error("Registration error", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <><ToastContainer/>
    <div className="container wrapper d-flex align-items-center justify-content-center mt-2">
      <form className="form_wrapper shadow px-3 py-3" onSubmit={handleRegister}>
        <div className="py-0">
          <label className="form-label">First Name</label>
          <input
            type="text"
            placeholder="First Name"
            className="form-control"
            name="firstName"
            value={signUpinfo.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="py-0">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            className="form-control"
            name="lastName"
            value={signUpinfo.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="py-0">
          <label className="form-label">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            name="email"
            value={signUpinfo.email}
            onChange={handleChange}
          />
        </div>
        <div className="py-0">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            name="password"
            value={signUpinfo.password}
            onChange={handleChange}
          />
        </div>
        <div className="py-0">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="form-control"
            name="confirmPassword"
            value={signUpinfo.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div className="d-grid mt-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Signup"}
          </button>
        </div>
        <div className="mt-2 d-flex justify-content-center align-items-center">
          <p>
            Already have an account? <a href="/login">Login Here</a>
          </p>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-2">
          <button className="btn btn-primary" disabled={loading}>Signup with Google</button>
        </div>
      </form>
    </div>
    </>
  );
}

export default Register;
