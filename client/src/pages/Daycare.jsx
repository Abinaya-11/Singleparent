import React, { useState } from 'react';
import { Heart, Share2, MoreHorizontal, Search, Bell, MessageSquare, User, Menu } from 'lucide-react';

const Groovetalks = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Alica Wonderland',
      avatar: 'AW',
      content: 'Just dropped us a fantastic session on "Mindset for Growth" 🌟. It\'s incredible how shifting our perspective can unlock so much potential. Remember, challenges aren\'t roadblocks, they\'re opportunities in disguise. What a vibe mindset shift helped you lately?',
      image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&h=300&fit=crop',
      likes: 94,
      shares: 22,
      isLiked: false,
      hasComment: true
    },
    {
      id: 2,
      author: 'Bob The Builder',
      avatar: 'BB',
      content: 'Learned a new productivity hack today: the "Pomodoro Technique" combined with deep work blocks. This focus activated was insane! Highly recommend giving it a try if you are struggling with distractions. #ProductivityTips #DeepWork #TimeManagement',
      image: null,
      likes: 86,
      shares: 15,
      isLiked: false,
      hasComment: true
    },
    {
      id: 3,
      author: 'Charlla Chaplin',
      avatar: 'CC',
      content: 'Reflecting on the importance of community in personal and professional growth. This platform has been an incredible platform for connecting with like-minded individuals and sharing insights. What\'s your favorite aspect of this community? 🌍',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=300&fit=crop',
      likes: 221,
      shares: 48,
      isLiked: false,
      hasComment: true
    },
    {
      id: 4,
      author: 'Diana Prince',
      avatar: 'DP',
      content: 'Excited to announce my upcoming webinar on "Sustainable Habits for Long-Term Success"! We\'ll dive deep into strategies proven to stick. Details and registration link coming soon! Stay tuned! #Webinar #SuccessHabits #PersonalDevelopment',
      image: null,
      likes: 156,
      shares: 63,
      isLiked: false,
      hasComment: true
    },
    {
      id: 5,
      author: 'Eve Harrington',
      avatar: 'EH',
      content: 'Reading "The 7 Habits of Highly Effective People" again, and it still hits different. The concepts of Begin with the End in Mind is truly foundational. What\'s a classic book that still impacts you?',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=300&fit=crop',
      likes: 192,
      shares: 31,
      isLiked: false,
      hasComment: true
    }
  ]);

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm">
              {post.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.author}</h3>
            </div>
          </div>
          <button className="px-4 py-1 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600 transition">
            Connect
          </button>
        </div>
       
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {post.content}
        </p>

        {post.image && (
          <div className="rounded-lg overflow-hidden mb-3">
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(post.id)}
              className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition"
            >
              <Heart
                className={`w-5 h-5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
           
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">{post.shares}</span>
            </button>
          </div>

          <button className="text-gray-400 hover:text-gray-600 transition">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="text-yellow-500 text-2xl">✨</div>
              <span className="font-bold text-xl text-gray-900">GrowTalks</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Home</a>
              <a href="#" className="text-yellow-600 font-medium text-sm border-b-2 border-yellow-500 pb-4">Feed</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Notifications</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Messages</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Profile</a>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search GrowTalks..."
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>
             
              <button className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition">
                + Post
              </button>

              <button className="text-gray-600 hover:text-gray-900 hidden md:block">
                <Bell className="w-5 h-5" />
              </button>

              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center cursor-pointer">
                <span className="text-white text-sm font-semibold">JS</span>
              </div>

              <button className="md:hidden text-gray-600">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900">Resources</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Legal</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a>
            </div>
           
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Groovetalks;