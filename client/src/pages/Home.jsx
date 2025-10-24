import React from 'react';
import { Link } from 'react-router-dom';
import { Heart} from 'lucide-react';
import homeIllustration from '../assets/home-illustration.png'; // Adjust if needed

export default function HomePage() {
  return (
    
    <div className="min-h-screen bg-[#F9E2B6] flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-8 py-6 relative">
      {/* Top-left Logo */}
      <div className="absolute top-4 left-4 sm:left-6 md:left-8 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#A07627] to-[#A07627] rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-[#433939]">CareGroove</span>
        </div>
      </div>

      {/* Top-right Navbar */}
      <div className="absolute top-4 right-4 sm:right-6 md:right-8 flex space-x-4 sm:space-x-6 text-sm sm:text-base md:text-lg font-semibold text-[#A07627] z-10">
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/register" className="hover:underline">Register</Link>
      </div>

      {/* Left: Image Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center px-4 md:px-0 mt-16 md:mt-0">
        <img
          src={homeIllustration}
          alt="Home Illustration"
          className="w-full max-w-xs sm:max-w-md md:max-w-[95%] lg:max-w-[750px] h-auto object-contain"
        />
      </div>

      {/* Right: Text and Buttons */}
      <div className="w-full md:w-1/2 text-center md:text-left space-y-6 px-4 sm:px-6 md:pl-20 mt-10 md:mt-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#A07627] leading-snug md:leading-tight font-habibi">
          Welcome to <br className="hidden md:block" /> Our Family
        </h1>

        {/* ✅ Added new paragraph here */}
        <p className="text-base sm:text-lg md:text-xl text-[#433939]">
          A supportive community built for single parents to connect, share, and grow. 
          Find resources, jobs, parenting tips, and real-time community support — all in one place.
        </p>

        <p className="text-base sm:text-lg md:text-xl text-[#433939] font-Habibi" >
          Built on Love, Backed by Community!
        </p>

        <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center sm:space-x-4 space-y-3 sm:space-y-0">
          <Link to="/login">
            <button className="bg-[#A07627] text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-[#8c641f] transition w-40 sm:w-auto font-habibi">
              Log In
            </button>
          </Link>

          <Link to="/register">
            <button className="bg-white text-[#A07627] font-bold py-2 px-6 rounded-lg shadow-md border border-[#A07627] hover:bg-[#f6e9cd] transition w-40 sm:w-auto font-habibi">
              Register
            </button>
          </Link>
        </div>

        <p className="text-sm text-[#433939]">
          Don’t have an account?{' '}
          <Link to="/register" className="underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
