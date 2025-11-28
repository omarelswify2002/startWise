import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaRocket, FaChartLine, FaUsers, FaLightbulb, FaHandshake, FaShieldAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {
  const [stats, setStats] = useState({
    startups: 0,
    investors: 0,
    advisors: 0,
    matches: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stats/public');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: <FaLightbulb className="text-4xl text-yellow-500" />,
      title: 'AI-Powered Matching',
      description: 'Our intelligent algorithm connects startups with the perfect investors and advisors based on industry, stage, and compatibility.'
    },
    {
      icon: <FaUsers className="text-4xl text-blue-500" />,
      title: 'Verified Network',
      description: 'Access a curated network of verified investors and experienced advisors ready to support your growth journey.'
    },
    {
      icon: <FaChartLine className="text-4xl text-green-500" />,
      title: 'Track Progress',
      description: 'Monitor your matches, conversations, and meetings all in one comprehensive dashboard.'
    },
    {
      icon: <FaHandshake className="text-4xl text-purple-500" />,
      title: 'Seamless Communication',
      description: 'Built-in messaging and meeting scheduling to facilitate meaningful connections.'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-red-500" />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy controls.'
    },
    {
      icon: <FaRocket className="text-4xl text-indigo-500" />,
      title: 'Fast & Efficient',
      description: 'Save time with automated matching and streamlined communication workflows.'
    }
  ];

  const statsDisplay = [
    { number: loading ? '...' : `${stats.startups}+`, label: 'Startups' },
    { number: loading ? '...' : `${stats.investors}+`, label: 'Investors' },
    { number: loading ? '...' : `${stats.advisors}+`, label: 'Advisors' },
    { number: loading ? '...' : `${stats.matches}+`, label: 'Matches Made' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaRocket className="text-3xl text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-gradient cursor-pointer" onClick={()=>{window.scrollTo(0,0)}}>StartWise</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-md font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect Your Startup with the
              <span className="text-gradient"> Right Investors</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              StartWise uses AI to match startups with investors and advisors who align with your vision, 
              industry, and growth stage. Stop searching, start connecting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
              >
                Upload Your Pitch Now
              </Link>
              <button
                onClick={() => {
                  document.getElementById("demoSection").scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50 transition"
              >
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {statsDisplay.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl font-bold text-gradient">{stat.number}</div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose StartWise?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to find the perfect match for your startup
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-xl hover:shadow-xl transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-purple-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get matched in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create Your Profile', desc: 'Sign up and complete your startup profile with your pitch deck and details' },
              { step: '2', title: 'Get AI Matches', desc: 'Our AI analyzes your profile and finds the best investors and advisors for you' },
              { step: '3', title: 'Connect & Grow', desc: 'Message matches, schedule meetings, and secure funding for your startup' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section (Mockup Version) */}
      <section id="demoSection" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-6"
          >
            See StartWise in Action 🚀
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Discover how our AI intelligently connects startups, investors, and advisors — 
            making collaboration faster, smarter, and more meaningful.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-2xl shadow-2xl max-w-5xl mx-auto"
          >
            {/* Mockup Window Header */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>

            {/* Mockup Content */}
            <div className="bg-white rounded-xl shadow-inner p-6 text-left">
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-gray-900 font-semibold text-lg"
              >
                🔍 Analyzing your startup profile...
              </motion.div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
                className="h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-4 mb-6"
              ></motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-purple-50 p-4 rounded-xl shadow-sm"
                >
                  <h3 className="font-bold text-purple-700 mb-2">Startup</h3>
                  <p className="text-gray-600 text-sm">
                    “EcoGrow” — AI-based sustainable farming solutions 🌱
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-blue-50 p-4 rounded-xl shadow-sm"
                >
                  <h3 className="font-bold text-blue-700 mb-2">Investor</h3>
                  <p className="text-gray-600 text-sm">
                    “GreenVentures” — Focused on sustainability tech 🌍
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-green-50 p-4 rounded-xl shadow-sm"
                >
                  <h3 className="font-bold text-green-700 mb-2">Advisor</h3>
                  <p className="text-gray-600 text-sm">
                    “Dr. Lina Omar” — Expert in AgriTech Innovation 💡
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="mt-10 text-center"
              >
                <p className="text-lg font-semibold text-gray-800">
                  ✅ Match Found! Your AI-powered connections are ready.
                </p>
              </motion.div>
            </div>
          </motion.div>

          <p className="text-gray-500 mt-6">
            *This is a simulated demo showing how StartWise matches startups, investors, and advisors.
          </p>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of startups already using StartWise to connect with investors and advisors
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FaRocket className="text-2xl text-purple-400" />
                <span className="ml-2 text-xl font-bold">StartWise</span>
              </div>
              <p className="text-gray-400">
                Connecting startups with the right investors and advisors through AI-powered matching.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" onClick={()=>{window.scrollTo(0,0)}} className="hover:text-white">Features</Link></li>
                <li><Link to="/faq" onClick={()=>{window.scrollTo(0,0)}} className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" onClick={()=>{window.scrollTo(0,0)}} className="hover:text-white">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" onClick={()=>{window.scrollTo(0,0)}} className="hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" onClick={()=>{window.scrollTo(0,0)}} className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StartWise System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

