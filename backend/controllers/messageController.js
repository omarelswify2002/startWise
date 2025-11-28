const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content, attachments, relatedTo } = req.body;

    // Generate conversation ID
    const conversationId = Message.generateConversationId(req.user._id, recipientId);

    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      recipientId,
      content,
      attachments,
      relatedTo
    });

    // Populate sender and recipient info
    await message.populate('senderId', 'name email profile.avatar role');
    await message.populate('recipientId', 'name email profile.avatar role');

    // Emit socket event for real-time messaging
    const io = req.app.get('io');
    if (io) {
      io.to(recipientId).emit('newMessage', message);
    }

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation between two users
// @route   GET /api/messages/conversation/:userId
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversationId = Message.generateConversationId(req.user._id, userId);

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name email profile.avatar role')
      .populate('recipientId', 'name email profile.avatar role')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Message.countDocuments({ conversationId });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: messages.reverse() // Reverse to show oldest first
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const User = require('../models/User');
    const userId = req.user._id;

    // Get all unique conversations
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { recipientId: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipientId', new mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Populate user details - need to populate each field separately
    for (let conv of conversations) {
      if (conv.lastMessage) {
        conv.lastMessage.senderId = await User.findById(conv.lastMessage.senderId).select('name email profile.avatar role');
        conv.lastMessage.recipientId = await User.findById(conv.lastMessage.recipientId).select('name email profile.avatar role');
      }
    }

    // Transform data to include participants array
    const transformedConversations = conversations
      .filter(conv => conv.lastMessage.senderId && conv.lastMessage.recipientId)
      .map(conv => {
        const sender = conv.lastMessage.senderId;
        const recipient = conv.lastMessage.recipientId;

        // Create participants array with both users
        const participants = [sender, recipient];

        return {
          _id: conv._id,
          participants,
          lastMessage: {
            content: conv.lastMessage.content,
            createdAt: conv.lastMessage.createdAt,
            senderId: conv.lastMessage.senderId._id
          },
          unreadCount: conv.unreadCount
        };
      });

    res.status(200).json({
      success: true,
      count: transformedConversations.length,
      data: transformedConversations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:conversationId
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Generate conversation ID
    const conversationId = Message.generateConversationId(req.user._id, userId);

    await Message.updateMany(
      {
        conversationId,
        recipientId: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: Date.now()
      }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Message.countDocuments({
      recipientId: req.user._id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Only sender can delete
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this message'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};



