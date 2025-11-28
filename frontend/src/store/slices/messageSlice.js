import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

const initialState = {
  conversations: [],
  currentConversation: [],
  unreadCount: 0,
  isLoading: false,
};

export const getConversations = createAsyncThunk('message/getConversations', async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
});

export const getConversation = createAsyncThunk('message/getConversation', async (userId) => {
  const response = await api.get(`/messages/conversation/${userId}`);
  return response.data;
});

export const sendMessage = createAsyncThunk('message/send', async (data) => {
  const response = await api.post('/messages', data);
  return response.data;
});

export const markAsRead = createAsyncThunk('message/markAsRead', async (conversationId) => {
  const response = await api.put(`/messages/read/${conversationId}`);
  return response.data;
});

export const getUnreadCount = createAsyncThunk('message/getUnreadCount', async () => {
  const response = await api.get('/messages/unread/count');
  return response.data;
});

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.currentConversation.push(action.payload);
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => { state.isLoading = true; })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload.data || [];
      })
      .addCase(getConversations.rejected, (state) => {
        state.isLoading = false;
        state.conversations = [];
      })
      .addCase(getConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload.data || [];
      })
      .addCase(getConversation.rejected, (state) => {
        state.isLoading = false;
        state.currentConversation = [];
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.currentConversation.push(action.payload.data);

        // Update the last message in conversations list
        const convIndex = state.conversations.findIndex(conv =>
          conv.participants.some(p => p._id === action.payload.data.recipientId._id)
        );
        if (convIndex !== -1) {
          state.conversations[convIndex].lastMessage = {
            content: action.payload.data.content,
            createdAt: action.payload.data.createdAt,
            senderId: action.payload.data.senderId._id
          };
        }
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count || 0;
      });
  },
});

export const { addMessage, clearCurrentConversation } = messageSlice.actions;
export default messageSlice.reducer;

