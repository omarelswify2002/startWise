import { FaRocket } from 'react-icons/fa';

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaRocket className="text-3xl text-purple-600 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">StartWise</h2>
          <p className="text-gray-600 animate-pulse">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-purple-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaRocket className="text-xl text-purple-600 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Loading;

