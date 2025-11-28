import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMatches, updateMatchStatus, generateMatches, getMatchesForInvestor, getMatchesForAdvisor } from '../store/slices/matchSlice';
import { getStartups, getMyStartup } from '../store/slices/startupSlice';
import { getMyInvestor } from '../store/slices/investorSlice';
import { getMyAdvisor } from '../store/slices/advisorSlice';
import { FaRocket, FaArrowLeft, FaEnvelope, FaStar, FaFilter, FaSync } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Matches = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { matches, isLoading, isGenerating } = useSelector((state) => state.match);
  const { startups, myStartup } = useSelector((state) => state.startup);
  const { myInvestor } = useSelector((state) => state.investor);
  const { myAdvisor } = useSelector((state) => state.advisor);

  // Try to find startup from myStartup first, then from startups array
  const userStartup = myStartup || startups?.find(s => s.userId === user?._id);

  const [filter, setFilter] = useState({
    type: 'all', // all, Investor, Advisor
    status: 'all', // all, Pending, Accepted, Rejected
    minScore: 0,
  });

  // Fetch user's profile based on role
  useEffect(() => {
    if (!user?._id) return;

    if (user.role === 'Startup') {
      console.log('Fetching startup profile for user:', user._id);
      dispatch(getMyStartup(user._id));
      dispatch(getStartups());
    } else if (user.role === 'Investor') {
      console.log('Fetching investor profile for user:', user._id);
      dispatch(getMyInvestor(user._id));
    } else if (user.role === 'Advisor') {
      console.log('Fetching advisor profile for user:', user._id);
      dispatch(getMyAdvisor(user._id));
    }
  }, [dispatch, user]);

  // Fetch matches when profile is found
  useEffect(() => {
    if (user?.role === 'Startup') {
      const currentUserStartup = myStartup || startups?.find(s => s.userId === user?._id);
      if (currentUserStartup?._id) {
        console.log('Fetching matches for startup:', currentUserStartup._id);
        dispatch(getMatches(currentUserStartup._id));
      }
    } else if (user?.role === 'Investor' && myInvestor?._id) {
      console.log('Fetching matches for investor:', myInvestor._id);
      dispatch(getMatchesForInvestor(myInvestor._id));
    } else if (user?.role === 'Advisor' && myAdvisor?._id) {
      console.log('Fetching matches for advisor:', myAdvisor._id);
      dispatch(getMatchesForAdvisor(myAdvisor._id));
    }
  }, [dispatch, user, myStartup, startups, myInvestor, myAdvisor]);

  const handleGenerateMatches = async () => {
    if (!userStartup?._id) {
      Swal.fire({
        icon: 'warning',
        title: 'Profile Incomplete',
        text: 'Please complete your startup profile first',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Generate Matches?',
      text: 'This will use AI to find the best investors and advisors for your startup',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Generate',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      dispatch(generateMatches(userStartup._id));
    }
  };

  const handleUpdateStatus = async (matchId, status) => {
    await dispatch(updateMatchStatus({ _id: matchId, status }));
  };

  const filteredMatches = matches.filter((match) => {
    if (filter.type !== 'all' && match.type !== filter.type) return false;
    if (filter.status !== 'all' && match.status !== filter.status) return false;
    if ((match.score || 0) < filter.minScore) return false;
    return true;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusBadge = (status) => {
    const styles = {
      Recommended: 'bg-blue-100 text-blue-800',
      Viewed: 'bg-purple-100 text-purple-800',
      Contacted: 'bg-indigo-100 text-indigo-800',
      'In Discussion': 'bg-yellow-100 text-yellow-800',
      Accepted: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Closed: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaRocket className="text-3xl text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-gradient">StartWise</span>
            </div>
            <Link to="/dashboard" className="text-gray-700 hover:text-purple-600 flex items-center">
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'Startup' ? 'Your Matches' : 'Startups Interested in You'}
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'Startup'
                ? 'AI-powered matches based on your profile'
                : 'Startups that match your profile and interests'}
            </p>
          </div>
          {user?.role === 'Startup' && (
            <button
              onClick={handleGenerateMatches}
              disabled={isGenerating}
              className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              <FaSync className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate Matches'}
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaFilter className="text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Match Type</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Investor">Investors</option>
                <option value="Advisor">Advisors</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Recommended">Recommended</option>
                <option value="Viewed">Viewed</option>
                <option value="Contacted">Contacted</option>
                <option value="In Discussion">In Discussion</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Score: {filter.minScore}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filter.minScore}
                onChange={(e) => setFilter({ ...filter, minScore: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Matches List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading matches...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Matches Found</h3>
            <p className="text-gray-600 mb-6">
              {matches.length === 0
                ? 'Generate matches to find investors and advisors for your startup'
                : 'Try adjusting your filters'}
            </p>
            {user?.role === 'Startup' && matches.length === 0 && (
              <button
                onClick={handleGenerateMatches}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Generate Matches Now
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredMatches.map((match) => {
              // For Startup: show candidateId (Investor/Advisor)
              // For Investor/Advisor: show startupId (Startup)
              let displayData, displayName, displayDescription, messageUserId;

              if (user?.role === 'Startup') {
                // Startup viewing their matches with Investors/Advisors
                displayData = match.candidateId;
                displayName = match.type === 'Investor'
                  ? displayData?.firmName || displayData?.name || 'Unknown Investor'
                  : displayData?.advisorName || displayData?.userId?.name || 'Unknown Advisor';
                displayDescription = match.type === 'Investor'
                  ? displayData?.description || displayData?.investmentFocus || ''
                  : displayData?.bio || displayData?.expertise || '';
                messageUserId = displayData?.userId?._id || displayData?.userId;
              } else {
                // Investor/Advisor viewing startups that matched with them
                displayData = match.startupId;
                displayName = displayData?.companyName || 'Unknown Startup';
                displayDescription = displayData?.description || displayData?.elevator || '';
                messageUserId = displayData?.userId?._id || displayData?.userId;
              }

              return (
              <div key={match._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {displayName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          match.status
                        )}`}
                      >
                        {match.status}
                      </span>
                      {user?.role === 'Startup' && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            match.type === 'Investor' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {match.type}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">
                      {displayDescription}
                    </p>
                  </div>

                  <div className="text-center ml-6">
                    <div className={`text-3xl font-bold ${getScoreColor(match.score || 0)} px-4 py-2 rounded-lg`}>
                      {match.score || 0}%
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Match Score</p>
                  </div>
                </div>

                {/* Match Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Why this match?</h4>
                  <p className="text-sm text-gray-700 mb-3">{match.reason}</p>

                  {match.highlights && match.highlights.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Highlights:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {match.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {match.status === 'Recommended' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(match._id, 'Contacted')}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        <FaEnvelope className="inline mr-2" />
                        Contact
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(match._id, 'Rejected')}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {(match.status === 'Contacted' || match.status === 'In Discussion' || match.status === 'Accepted') && messageUserId && (
                    <Link
                      to={`/messages?userId=${messageUserId}`}
                      className="flex-1 flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                      <FaEnvelope className="mr-2" />
                      Send Message
                    </Link>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Matches;
