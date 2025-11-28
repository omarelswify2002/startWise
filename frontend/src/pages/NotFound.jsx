import { Link } from 'react-router-dom';
import { FaRocket, FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center justify-center mb-8">
          <FaRocket className="text-5xl text-purple-600" />
          <span className="ml-3 text-4xl font-bold text-gradient">StartWise</span>
        </Link>

        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            404
          </h1>
          <div className="text-6xl mb-4">🚀💫</div>
        </div>

        {/* Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Looks like this page took off to another galaxy! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaHome className="mr-2" />
              Go to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Link to="/" className="text-purple-600 hover:text-purple-700 font-medium">
              Home
            </Link>
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              Login
            </Link>
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
              Register
            </Link>
            <Link to="/dashboard" className="text-purple-600 hover:text-purple-700 font-medium">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

