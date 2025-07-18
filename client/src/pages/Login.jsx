// src/Login.js
import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - purple gradient */}
      <div className="w-1/2 bg-gradient-to-bl from-purple-900 to-purple-300"></div>

      {/* Right side - form */}
      <div className="w-1/2 flex items-center justify-center bg-purple-200">
        <div className="w-3/4 max-w-md">
          <h2 className="text-3xl font-semibold text-center text-purple-900 italic mb-6">
            Welcome
          </h2>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded bg-white border focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded bg-white border focus:outline-none"
            />

            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold">
              Log In
            </button>

            <button className="w-full bg-white border border-purple-600 text-purple-700 py-2 rounded font-semibold">
              Register
            </button>

            <div className="text-center text-sm text-gray-600">or</div>

            <button className="w-full flex items-center justify-center bg-white py-2 border rounded hover:shadow-md">
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google"
                className="mr-2"
              />
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-700">
            Don’t have an account?{" "}
            <span className="text-purple-800 font-semibold cursor-pointer underline">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;