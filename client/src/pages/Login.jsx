import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // fix here

import googleIcon from "../assets/google-icon.png";
import illustration from "../assets/login-illustration.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        setMessage("✅ Login successful!");
        // Optionally save token to localStorage
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setMessage("❌ Invalid credentials");
      }
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.msg || "Error logging in"));
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const decoded = jwtDecode(tokenResponse.credential);
        console.log("Google user:", decoded);

        setMessage(`✅ Welcome ${decoded.name}`);
        navigate("/dashboard");
      } catch (error) {
        console.error("Google Login Error:", error);
        setMessage("❌ Google login failed");
      }
    },
    onError: () => {
      setMessage("❌ Google login failed");
    },
    flow: "implicit",
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* LEFT: Illustration */}
      <div className="w-full md:w-[60%] flex items-center justify-center bg-white py-10">
        <img
          src={illustration}
          alt="Login Illustration"
          className="w-[80%] max-w-sm md:max-w-[75%] object-contain"
        />
      </div>

      {/* RIGHT: Form */}
      <div className="w-full md:w-[40%] bg-[#fcd385] flex flex-col justify-center px-6 sm:px-12 py-10">
        <h2 className="text-2xl italic text-[#805300] mb-8 text-center">
          Welcome
        </h2>

        <form onSubmit={handleLogin}>
          <div className="flex items-center bg-white rounded-md px-3 py-2 mb-4">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="Email"
              className="w-full outline-none bg-transparent text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center bg-white rounded-md px-3 py-2 mb-6">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none bg-transparent text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#ecb129] text-white font-semibold py-2 rounded-md mb-4 w-full hover:bg-[#d8a419]"
          >
            Log In
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-red-700 italic mb-3">
            {message}
          </p>
        )}

        <Link to="/register">
          <button className="bg-white text-[#ecb129] font-semibold border border-[#ecb129] py-2 rounded-md mb-4 w-full hover:bg-[#fff4dc]">
            Register
          </button>
        </Link>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-600" />
          <span className="mx-2 text-sm text-gray-700">or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        <button
          onClick={() => googleLogin()}
          className="bg-white border py-2 rounded-md flex justify-center items-center gap-2 mb-4 w-full hover:bg-[#f4f4f4]"
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5" />
          <span className="font-semibold text-sm">Sign in with Google</span>
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="italic underline text-[#805300]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
