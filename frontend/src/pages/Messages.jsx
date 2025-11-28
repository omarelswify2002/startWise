import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations, getConversation, sendMessage, markAsRead } from '../store/slices/messageSlice';
import { FaRocket, FaArrowLeft, FaPaperPlane, FaSearch } from 'react-icons/fa';
import api from '../config/api';

const Messages = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { conversations, currentConversation, isLoading } = useSelector((state) => state.message);
  const [searchParams] = useSearchParams();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newConversationUser, setNewConversationUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(getConversations());

    // Check if there's a userId in URL params to start a new conversation
    const userIdFromUrl = searchParams.get('userId');
    if (userIdFromUrl) {
      setSelectedUserId(userIdFromUrl);

      // Fetch user details for new conversation
      const fetchUserDetails = async () => {
        try {
          const response = await api.get(`/users/${userIdFromUrl}`);
          setNewConversationUser(response.data.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
      fetchUserDetails();
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (selectedUserId) {
      dispatch(getConversation(selectedUserId));
      dispatch(markAsRead(selectedUserId));
    }
  }, [dispatch, selectedUserId]);

  // Auto-scroll to bottom when conversation changes or new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUserId) return;

    await dispatch(sendMessage({ recipientId: selectedUserId, content: messageText }));
    setMessageText('');
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!conv.participants || conv.participants.length === 0) return false;
    const other = conv.participants.find((p) => {
      if (!p) return false;
      const pid = p._id || p.userId || p;
      return pid !== user?._id;
    });
    const name = other?.name || other?.userId?.name || other?.email || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedConversation = conversations.find((conv) =>
    conv.participants.some((p) => {
      const pid = p?._id || p?.userId || p;
      return pid === selectedUserId;
    })
  );

  // Use existing conversation user or new conversation user
  const otherUser = (() => {
    const p = selectedConversation?.participants.find((p) => {
      const pid = p?._id || p?.userId || p;
      return pid !== user?._id;
    });
    return p || newConversationUser;
  })();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    if (!conv.participants || conv.participants.length === 0) return null;
                    const otherParticipant = conv.participants.find((p) => {
                      if (!p) return false;
                      const pid = p._id || p.userId || p;
                      return pid !== user?._id;
                    });
                    if (!otherParticipant) return null;
                    const otherId = otherParticipant._id || otherParticipant.userId || otherParticipant;
                    const isSelected = selectedUserId === otherId;
                    const hasUnread = conv.unreadCount > 0;

                    return (
                      <div
                        key={conv._id}
                        onClick={() => setSelectedUserId(otherId)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition ${
                          isSelected ? 'bg-purple-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-semibold ${hasUnread ? 'text-purple-600' : 'text-gray-900'}`}>
                                {otherParticipant.name || otherParticipant.userId?.name || otherParticipant.email}
                              </h3>
                              {hasUnread && (
                                <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conv.lastMessage?.content || 'No messages yet'}
                            </p>
                          </div>
                          {conv.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatDate(conv.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedUserId ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">{otherUser?.name}</h2>
                    <p className="text-sm text-gray-600">{otherUser?.email}</p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentConversation.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      <>
                        {currentConversation.map((message) => {
                          const isMine = message.senderId?._id === user?._id || message.senderId === user?._id;
                          return (
                            <div key={message._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  isMine
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${isMine ? 'text-purple-200' : 'text-gray-500'}`}>
                                  {formatDate(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <FaPaperPlane className="mr-2" />
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <FaPaperPlane className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-lg">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
