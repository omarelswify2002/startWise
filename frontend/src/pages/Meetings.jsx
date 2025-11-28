import { Link } from 'react-router-dom';
import { FaRocket, FaArrowLeft, FaPlus, FaCalendar, FaClock, FaVideo, FaCheck, FaTimes, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMeetings, createMeeting, respondToMeeting, getPendingMeetingsCount } from '../store/slices/meetingSlice';
import { getConversations } from '../store/slices/messageSlice';
import Swal from 'sweetalert2';
import Loading from '../components/Loading';

const Meetings = () => {
  const dispatch = useDispatch();
  const { meetings, isLoading } = useSelector((state) => state.meeting);
  const { conversations } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, pending
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 30,
    meetingLink: '',
    location: '',
    participants: []
  });

  useEffect(() => {
    dispatch(getMeetings());
    dispatch(getConversations());
  }, [dispatch]);

  const handleCreateMeeting = async (e) => {
    e.preventDefault();

    // Validate participants
    if (formData.participants.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Participants',
        text: 'Please select at least one participant for the meeting',
      });
      return;
    }

    // Combine date and time
    const startTime = new Date(`${formData.date}T${formData.time}`);

    // Calculate end time based on duration (in minutes)
    const endTime = new Date(startTime.getTime() + formData.duration * 60000);

    // Format participants as required by backend: array of { userId: id }
    const participants = formData.participants.map(userId => ({ userId }));

    const meetingData = {
      title: formData.title,
      description: formData.description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      meetingLink: formData.meetingLink,
      location: formData.location,
      participants
    };

    await dispatch(createMeeting(meetingData));
    dispatch(getPendingMeetingsCount()); // Update pending count for participants
    setShowCreateModal(false);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 30,
      meetingLink: '',
      location: '',
      participants: []
    });
  };

  const toggleParticipant = (userId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(userId)
        ? prev.participants.filter(id => id !== userId)
        : [...prev.participants, userId]
    }));
  };

  // Get available participants from conversations
  const getAvailableParticipants = () => {
    if (!conversations || conversations.length === 0) return [];

    return conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p._id !== user?._id);
      return otherParticipant;
    }).filter(Boolean);
  };

  const handleRespond = async (meetingId, status) => {
    await dispatch(respondToMeeting({ id: meetingId, status }));
    dispatch(getPendingMeetingsCount()); // Update pending count
    Swal.fire({
      icon: 'success',
      title: 'Response Recorded!',
      text: `You have ${status} the meeting invitation`,
      timer: 2000
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPast = (dateString) => {
    return new Date(dateString) < new Date();
  };

  const getFilteredMeetings = () => {
    if (!meetings) return [];

    switch (filter) {
      case 'upcoming':
        return meetings.filter(m => !isPast(m.scheduledAt));
      case 'past':
        return meetings.filter(m => isPast(m.scheduledAt));
      case 'pending':
        return meetings.filter(m => {
          const participant = m.participants?.find(p => p.userId === user?.id);
          return participant?.status === 'Pending';
        });
      default:
        return meetings;
    }
  };

  const filteredMeetings = getFilteredMeetings();

  if (isLoading) {
    return <Loading />;
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            <FaPlus className="mr-2" />
            Schedule Meeting
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          {['all', 'upcoming', 'past', 'pending'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {filteredMeetings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No meetings found</p>
              <p className="text-gray-400 mt-2">Schedule a meeting to get started</p>
            </div>
          ) : (
            filteredMeetings.map((meeting) => {
              const userParticipant = meeting.participants?.find(p => p.userId === user?.id);
              const isOrganizer = meeting.organizer === user?.id;

              return (
                <div key={meeting._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{meeting.title}</h3>
                      <p className="text-gray-600 mb-4">{meeting.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-700">
                          <FaCalendar className="mr-2 text-purple-600" />
                          {formatDate(meeting.scheduledAt)}
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FaClock className="mr-2 text-blue-600" />
                          {formatTime(meeting.scheduledAt)} ({meeting.duration} min)
                        </div>
                        {meeting.meetingLink && (
                          <div className="flex items-center text-gray-700">
                            <FaVideo className="mr-2 text-green-600" />
                            <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Join Meeting
                            </a>
                          </div>
                        )}
                        {meeting.location && (
                          <div className="flex items-center text-gray-700">
                            <FaMapMarkerAlt className="mr-2 text-red-600" />
                            {meeting.location}
                          </div>
                        )}
                      </div>

                      {/* Participants */}
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Participants:</p>
                        <div className="flex flex-wrap gap-2">
                          {meeting.participants?.map((participant, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                participant.status === 'Accepted'
                                  ? 'bg-green-100 text-green-700'
                                  : participant.status === 'Declined'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {participant.userId === user?.id ? 'You' : `User ${idx + 1}`} - {participant.status}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {!isOrganizer && userParticipant?.status === 'Pending' && !isPast(meeting.scheduledAt) && (
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleRespond(meeting._id, 'Accepted')}
                          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          <FaCheck className="mr-2" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespond(meeting._id, 'Declined')}
                          className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          <FaTimes className="mr-2" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Schedule New Meeting</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateMeeting} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                    placeholder="Quarterly Review Meeting"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Discuss project progress and next steps..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="https://zoom.us/j/123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Conference Room A, Building 1"
                  />
                </div>

                {/* Participants Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUsers className="inline mr-2" />
                    Participants *
                  </label>
                  {getAvailableParticipants().length === 0 ? (
                    <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                      No contacts available. Start a conversation with someone first to invite them to meetings.
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                      {getAvailableParticipants().map((participant) => (
                        <label
                          key={participant._id}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={formData.participants.includes(participant._id)}
                            onChange={() => toggleParticipant(participant._id)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {participant.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {participant.email}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  {formData.participants.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {formData.participants.length} participant(s) selected
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Schedule Meeting
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meetings;

