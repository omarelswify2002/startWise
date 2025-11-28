import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { generateMatches } from '../store/slices/matchSlice';
import { getUnreadCount } from '../store/slices/messageSlice';
import { getPendingMeetingsCount } from '../store/slices/meetingSlice';
import { FaRocket, FaUser, FaChartLine, FaEnvelope, FaCalendar, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import api from '../config/api';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.message);
  const { pendingCount } = useSelector((state) => state.meeting);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStartups: 0,
    totalInvestors: 0,
    totalAdvisors: 0,
    totalMatches: 0,
    totalMessages: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role !== 'Admin') return;
      try {
        const res = await api.get('/admin/stats');
        const overview = res.data?.data?.overview || {};
        setStats((s) => ({
          ...s,
          totalUsers: overview.totalUsers || 0,
          totalStartups: overview.totalStartups || 0,
          totalInvestors: overview.totalInvestors || 0,
          totalAdvisors: overview.totalAdvisors || 0,
          totalMatches: overview.totalMatches || 0,
          totalMessages: overview.totalMessages || 0,
        }));
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchStats();
  }, [user]);

  // Fetch unread message count and pending meetings count for all users
  useEffect(() => {
    if (user) {
      dispatch(getUnreadCount());
      dispatch(getPendingMeetingsCount());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const { startups, myStartup } = useSelector((state) => state.startup);

  const handleQuickGenerate = async () => {
    // only for Startups
    if (user?.role !== 'Startup') {
      navigate('/matches');
      return;
    }

    const userStartup = myStartup || startups?.find((s) => s.userId === user?._id);

    if (!userStartup?._id) {
      // Ask user to complete profile first
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Profile Incomplete',
        text: 'Please complete your startup profile before generating matches. Go to profile now?',
        showCancelButton: true,
        confirmButtonText: 'Yes, take me',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) navigate('/startup/profile');
      return;
    }

    // Trigger generation and navigate to matches
    dispatch(generateMatches(userStartup._id));
    navigate('/matches');
  };

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'Startup':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'User'}!</h2>
              <p className="text-purple-100">Ready to find your perfect investors and advisors?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Matches</h3>
                  <FaChartLine className="text-2xl text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600 mt-2">AI-generated matches</p>
                <Link
                  to="/matches"
                  className="mt-4 block text-center bg-purple-100 text-purple-600 py-2 rounded-lg hover:bg-purple-200 transition"
                >
                  View Matches
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                  <FaEnvelope className="text-2xl text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{unreadCount || 0}</p>
                <p className="text-sm text-gray-600 mt-2">Unread messages</p>
                <Link
                  to="/messages"
                  className="mt-4 block text-center bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition"
                >
                  View Messages
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Meetings</h3>
                  <FaCalendar className="text-2xl text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{pendingCount || 0}</p>
                <p className="text-sm text-gray-600 mt-2">Pending invitations</p>
                <Link
                  to="/meetings"
                  className="mt-4 block text-center bg-green-100 text-green-600 py-2 rounded-lg hover:bg-green-200 transition"
                >
                  View Meetings
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/startup/profile"
                  className="flex items-center p-4 border-2 border-purple-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition"
                >
                  <FaUser className="text-2xl text-purple-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete Your Profile</h4>
                    <p className="text-sm text-gray-600">Add your startup details and pitch deck</p>
                  </div>
                </Link>
                <button
                  onClick={handleQuickGenerate}
                  className="flex items-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
                >
                  <FaPlus className="text-2xl text-blue-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Generate Matches</h4>
                    <p className="text-sm text-gray-600">Find investors and advisors for you</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'Investor':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'User'}!</h2>
              <p className="text-green-100">Discover promising startups to invest in</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommended Startups</h3>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <Link
                  to="/matches"
                  className="mt-4 block text-center bg-green-100 text-green-600 py-2 rounded-lg hover:bg-green-200 transition"
                >
                  View Startups
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
                <p className="text-3xl font-bold text-gray-900">{unreadCount || 0}</p>
                <Link
                  to="/messages"
                  className="mt-4 block text-center bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition"
                >
                  View Messages
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Meetings</h3>
                <p className="text-3xl font-bold text-gray-900">{pendingCount || 0}</p>
                <p className="text-sm text-gray-600 mt-2">Pending invitations</p>
                <Link
                  to="/meetings"
                  className="mt-4 block text-center bg-purple-100 text-purple-600 py-2 rounded-lg hover:bg-purple-200 transition"
                >
                  View Meetings
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <Link
                to="/investor/profile"
                className="flex items-center p-4 border-2 border-green-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition"
              >
                <FaUser className="text-2xl text-green-600 mr-4" />
                <div>
                  <h4 className="font-semibold text-gray-900">Complete Your Profile</h4>
                  <p className="text-sm text-gray-600">Add your investment preferences and portfolio</p>
                </div>
              </Link>
            </div>
          </div>
        );

      case 'Advisor':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'User'}!</h2>
              <p className="text-orange-100">Help startups succeed with your expertise</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Matched Startups</h3>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <Link
                  to="/matches"
                  className="mt-4 block text-center bg-orange-100 text-orange-600 py-2 rounded-lg hover:bg-orange-200 transition"
                >
                  View Startups
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
                <p className="text-3xl font-bold text-gray-900">{unreadCount || 0}</p>
                <Link
                  to="/messages"
                  className="mt-4 block text-center bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition"
                >
                  View Messages
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Meetings</h3>
                <p className="text-3xl font-bold text-gray-900">{pendingCount || 0}</p>
                <p className="text-sm text-gray-600 mt-2">Pending invitations</p>
                <Link
                  to="/meetings"
                  className="mt-4 block text-center bg-purple-100 text-purple-600 py-2 rounded-lg hover:bg-purple-200 transition"
                >
                  View Meetings
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <Link
                to="/advisor/profile"
                className="flex items-center p-4 border-2 border-orange-200 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition"
              >
                <FaUser className="text-2xl text-orange-600 mr-4" />
                <div>
                  <h4 className="font-semibold text-gray-900">Complete Your Profile</h4>
                  <p className="text-sm text-gray-600">Add your expertise and specializations</p>
                </div>
              </Link>
            </div>
          </div>
        );

      case 'Admin':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
              <p className="text-gray-300">Manage the StartWise platform</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Startups</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStartups}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Investors</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.totalInvestors}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Advisors</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAdvisors}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <Link
                to="/admin"
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-600 hover:bg-gray-50 transition"
              >
                <FaChartLine className="text-2xl text-gray-600 mr-4" />
                <div>
                  <h4 className="font-semibold text-gray-900">View Full Admin Panel</h4>
                  <p className="text-sm text-gray-600">Manage users, view reports, and analytics</p>
                </div>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (!user) {
    return <Loading fullScreen message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaRocket className="text-3xl text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-gradient">StartWise</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/messages" className="relative text-gray-700 hover:text-purple-600 transition">
                <FaEnvelope className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/meetings" className="text-gray-700 hover:text-purple-600 transition">
                <FaCalendar className="text-xl" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Guest'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 transition"
                title="Logout"
              >
                <FaSignOutAlt className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {getDashboardContent()}
      </main>
    </div>
  );
};

export default Dashboard;

