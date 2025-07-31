import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import illustration from "../assets/login-illustration.jpg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });

      if (res.data.success) {
        setMsg("✅ Registered successfully!");
        // navigate("/");
      }
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || "Error during registration"));
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fcd385] font-sans">
      {/* LEFT PANEL - Illustration */}
      <div className="w-full md:w-[60%] flex items-center justify-center bg-white py-10 md:py-0">
        <img
          src={illustration}
          alt="Login Illustration"
          className="w-[75%] object-contain"
        />
      </div>

      {/* RIGHT PANEL - Form */}
      <div className="w-full md:w-[40%] flex flex-col justify-center px-6 md:px-12 py-10">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl italic text-center text-[#805300] mb-6">
            Create Account
          </h2>

          <form onSubmit={handleRegister}>
            <div className="flex items-center bg-white px-3 py-2 rounded-md mb-4">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="outline-none w-full bg-transparent text-sm"
              />
            </div>

            <div className="flex items-center bg-white px-3 py-2 rounded-md mb-4">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="outline-none w-full bg-transparent text-sm"
              />
            </div>

            <div className="flex items-center bg-white px-3 py-2 rounded-md mb-6">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="outline-none w-full bg-transparent text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-[#ecb129] hover:bg-yellow-600 text-white py-2 w-full rounded-md font-semibold"
            >
              Register
            </button>
          </form>

          {msg && (
            <p className="text-sm text-center mt-4 italic text-red-700">
              {msg}
            </p>
          )}

          <p className="text-sm italic text-gray-700 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#805300] font-semibold underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
