import React, { useState } from 'react';
import { Mail, Phone, MapPin, User, Menu, X } from 'lucide-react';

const FundNest = () => {
  const [activeTab, setActiveTab] = useState('most-urgent');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const campaigns = {
    'most-urgent': [
      {
        id: 1,
        title: 'Wildlife Conservation Project',
        description: 'Our initiative aims to secure a balanced and thriving from habitat loss and climate change. This project focuses on protecting endangered species and their natural habitats across multiple continents.',
        image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=250&fit=crop',
        raised: '$45,000',
        goal: '$75,000',
        percentage: 60,
        organization: 'Wildlife Foundation',
        email: 'wildlife@conservation.org',
        phone: '+1 (555) SAVE-9812',
        address: 'Boston'
      },
      {
        id: 2,
        title: 'Clean Water Initiative for Rural Villages',
        description: 'Access to clean and safe drinking water is a fundamental human right. This initiative aims to install sustainable water purification systems in remote rural communities so fragrance practices in',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
        raised: '$12,600',
        goal: '$20,000',
        percentage: 63,
        organization: 'Pure Water',
        email: 'water.outreach@fund.ng',
        phone: '+1 (555) HELP-1450',
        address: 'Durban'
      },
      {
        id: 3,
        title: 'Support for Local Arts Programs',
        description: 'Arts programs in schools and communities help foster creativity, self-expression, and cultural awareness and cultural enrichment, fun often have underfunding. This campaign supports arts education initiatives across.',
        image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=250&fit=crop',
        raised: '$6,785',
        goal: '$15,000',
        percentage: 45,
        organization: 'Arts Education',
        email: 'fundnest@donationcamping',
        phone: '+1 (555) 877-1245',
        address: 'Durban'
      }
    ],
    'recently-added': [
      {
        id: 4,
        title: 'Emergency Aid for Flood Victims',
        description: 'Severe floods have displaced thousands of people and caused chaos floods in the region. Families have lost homes, livelihoods, and access to basic necessities. Your urgent donation will provide shelter.',
        image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&h=250&fit=crop',
        raised: '$30,200',
        goal: '$50,000',
        percentage: 60,
        organization: 'Disaster Relief',
        email: 'emergency@reliefcentre.me',
        phone: '+1 (555) U123-740',
        address: 'Manila'
      },
      {
        id: 5,
        title: "Support for Children's Education",
        description: 'Many children in underserved communities lack access to quality education. This campaign aims to provide school supplies, tuition fees, and tutoring programs to ensure every child as a chance to learn.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop',
        raised: '$18,400',
        goal: '$25,000',
        percentage: 74,
        organization: 'Educate All',
        email: 'children@sponsorship.com',
        phone: '+1 (555) 336-6025',
        address: 'Durban'
      },
      {
        id: 6,
        title: 'Medical Care for Homeless Individuals',
        description: 'Homeless individuals often face significant health challenges without access to proper medical care. This campaign provides essential health screenings, treatments, and wellness programs for those in need.',
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=250&fit=crop',
        raised: '$22,150',
        goal: '$40,000',
        percentage: 55,
        organization: 'Health Outreach',
        email: 'medical@outreachservice',
        phone: '+1 (555) CARE-NOW',
        address: 'Calgary'
      }
    ],
    'highest-funded': [
      {
        id: 7,
        title: 'Global Education Initiative',
        description: 'Building schools and providing quality education to underserved communities worldwide. This comprehensive program includes teacher training and educational resources.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=250&fit=crop',
        raised: '$85,000',
        goal: '$100,000',
        percentage: 85,
        organization: 'Education First',
        email: 'global@education.org',
        phone: '+1 (555) LEARN-01',
        address: 'London'
      }
    ]
  };

  const CampaignCard = ({ campaign }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative overflow-hidden h-48">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
     
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {campaign.title}
        </h3>
       
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {campaign.description}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-700">
              Raised: <span className="font-semibold text-gray-900">{campaign.raised}</span>
            </span>
            <span className="text-gray-700">
              Goal: <span className="font-semibold text-gray-900">{campaign.goal}</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${campaign.percentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2 text-yellow-600" />
            <span>{campaign.organization}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="truncate">{campaign.email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-yellow-600" />
            <span>{campaign.phone}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-yellow-600" />
            <span>Enter pincode to donate</span>
          </div>
        </div>

        <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300">
          Donate Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-yellow-600 italic">Logo</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                Browse Campaigns
              </a>
              <a href="#" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                Start a Fund
              </a>
              <a href="#" className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                About Us
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                Login
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-full font-semibold transition-colors">
                Sign Up
              </button>
              <button className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#" className="text-gray-700 hover:text-yellow-600 font-medium">
                  Browse Campaigns
                </a>
                <a href="#" className="text-gray-700 hover:text-yellow-600 font-medium">
                  Start a Fund
                </a>
                <a href="#" className="text-gray-700 hover:text-yellow-600 font-medium">
                  About Us
                </a>
                <button className="text-left text-gray-700 hover:text-yellow-600 font-medium">
                  Login
                </button>
                <button className="bg-yellow-600 text-white px-6 py-2 rounded-full font-semibold text-left">
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Active Campaigns</h1>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('most-urgent')}
            className={`pb-4 px-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'most-urgent'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Most Urgent
          </button>
          <button
            onClick={() => setActiveTab('recently-added')}
            className={`pb-4 px-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'recently-added'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recently Added
          </button>
          <button
            onClick={() => setActiveTab('highest-funded')}
            className={`pb-4 px-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'highest-funded'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Highest Funded
          </button>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {campaigns[activeTab].map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Empowering Change, Together
            </h2>
          </div>
          <div className="mt-6 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=200&fit=crop"
              alt="Community"
              className="w-64 h-32 object-cover rounded-lg"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">FundNest</h3>
              <p className="text-gray-400 text-sm">
                Empowering communities through transparent fundraising
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Campaigns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 FundNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FundNest;