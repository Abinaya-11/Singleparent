import React, { useState } from 'react';
import { User, Lightbulb, Heart, Home, Users, MapPin, MessageCircle, Handshake,Bell } from 'lucide-react';
import mainimage from "../assets/hero_section.webp";
import e1 from "../assets/E1.jpg";
import e3 from "../assets/E3.jpg";
import e2 from "../assets/E2.png";
import e4 from "../assets/E4.png";
const MainPage = () => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    'hero',
    'resources',
    'community',
    'profiles',
    'stories',
    'testimonials'
  ];

  const scrollToSection = (index) => {
    setCurrentSection(index);
    const element = document.getElementById(sections[index]);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareGroove</span>
            </div>
           
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection(0)} className="text-gray-700 hover:text-amber-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection(1)} className="text-gray-700 hover:text-amber-600 transition-colors">Explore</button>
              <button onClick={() => scrollToSection(2)} className="text-gray-700 hover:text-amber-600 transition-colors">Community</button>
              <button onClick={() => scrollToSection(3)} className="text-gray-700 hover:text-amber-600 transition-colors">Resources</button>
              <button className="text-gray-700 hover:text-amber-600 transition-colors">My Networks</button>
              {/* ✅ Changed About Us to scroll to footer */}
              <button onClick={() => {
                const element = document.getElementById('footer');
                element?.scrollIntoView({ behavior: 'smooth' });
              }} className="text-gray-700 hover:text-amber-600 transition-colors">About Us</button>
            </div>
           
            {/* Profile + Notification icons */}
            <div className="flex space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 transition">
                <Bell className="w-6 h-6 text-gray-700" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition">
                <User className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                A Place for Single Parents to Connect, Grow, and Thrive.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Parenting isn't meant to be a solo journey. Here, you'll find connection, encouragement, and people who truly understand.
              </p>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:shadow-lg transform hover:-translate-y-1">
                Join Our Community
              </button>
            </div>
           
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-8 shadow-2xl">
                <img
                  src={mainimage}
                  alt="Mother and child with tablet"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Heart className="w-12 h-12 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Our GrowConnect</h2>
            <p className="text-xl text-gray-600">Discover a variety of resources designed to support single parents.</p>
          </div>
         
          {/* First row (3 items) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">GrowTalks</h3>
              <p className="text-gray-600">Join live hangouts and gain insight to make your day.</p>
            </div>
           
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">JobHive</h3>
              <p className="text-gray-600">Empowering single parents with new job opportunities.</p>
            </div>
           
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Hug & Hand</h3>
              <p className="text-gray-600">A helping hand to lean on every single parent's need.</p>
            </div>
          </div>

          {/* Second row (FundNest & KidCare centered, same size as first row cards) */}
            <div className="flex justify-center gap-8">
            <div className="w-full md:w-1/2 lg:w-1/3 text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">FundNest</h3>
                <p className="text-gray-600">Find financial help for your family and children.</p>
            </div>
            
            <div className="w-full md:w-1/2 lg:w-1/3 text-center p-8 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">DayCare</h3>
                <p className="text-gray-600">Trusted care for your little ones so you can focus.</p>
            </div>
            </div>
        </div>
      </section>

      {/* Community Forum Section */}
      <section id="community" className="py-20 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Join Our Community Forum</h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Where strength meets community, and every journey is celebrated. Connect with parents who understand, share experiences, and grow stronger together.
          </p>
         
          <div className="flex justify-center mb-8">
            <div className="flex -space-x-4">
              <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=face" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" alt="Community member" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" alt="Community member" />
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" alt="Community member" />
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" alt="Community member" />
              <img src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=80&h=80&fit=crop&crop=face" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" alt="Community member" />
            </div>
          </div>
         
          <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:shadow-lg transform hover:-translate-y-1 border border-gray-200">
            Get Started
          </button>
        </div>
      </section>

      {/* Suggested Profiles Section */}
      <section id="profiles" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Suggested Profiles for You</h2>
            <p className="text-xl text-gray-600">Connect with other parents who share similar interests and journeys.</p>
          </div>
         
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=face" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" alt="Jessica A." />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Jessica A.</h3>
              <p className="text-gray-600 text-sm mb-4">Single mom of two, loves hiking and coffee.</p>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Connect</button>
            </div>
           
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" alt="Mark S." />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mark S.</h3>
              <p className="text-gray-600 text-sm mb-4">Single dad, passionate about cooking and fitness.</p>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Connect</button>
            </div>
           
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" alt="Sarah L." />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah L.</h3>
              <p className="text-gray-600 text-sm mb-4">New single mom, seeking advice and friendship.</p>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Connect</button>
            </div>
           
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" alt="Daniel H." />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Daniel H.</h3>
              <p className="text-gray-600 text-sm mb-4">Father of three, enjoys sports and family trips.</p>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Connect</button>
            </div>
          </div>
        </div>
      </section>

      {/* Empowering Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-4">
                <img src={e1}className="rounded-xl shadow-md" alt="Event 1" />
                <img src={e2}className="rounded-xl shadow-md" alt="Event 2" />
                <img src={e4}className="rounded-xl shadow-md" alt="Event 4" />
                <img src={e3}className="rounded-xl shadow-md" alt="Event 3" />
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Empowering Single Parents</h2>
                <p className="text-gray-700 leading-relaxed">
                  A safe space built for single parents — our community-focused platform brings parents together to share, connect, and grow stronger. From emotional support to practical resources, we help you navigate the unique challenges where no single parent ever feels alone.
                </p>
              </div>
            </div>
          </div>
        </section>

      {/* Footer */}
      <footer id="footer" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">CareGroove</span>
              </div>
              <p className="text-gray-400">Empowering single parents to connect, grow, and thrive together in a supportive community.</p>
            </div>
           
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">GrowTalks</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SkillHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FundNest</a></li>
                <li><a href="#" className="hover:text-white transition-colors">KidCare</a></li>
              </ul>
            </div>
           
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Support Circles</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Forums</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
           
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
         
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CareGroove. All rights reserved. Made with ❤️ for single parents everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
