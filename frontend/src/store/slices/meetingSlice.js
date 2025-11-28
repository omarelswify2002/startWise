import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';
import Swal from 'sweetalert2';

const initialState = {
  meetings: [],
  meeting: null,
  pendingCount: 0,
  isLoading: false,
};

export const getMeetings = createAsyncThunk('meeting/getAll', async (params) => {
  const response = await api.get('/meetings', { params });
  return response.data;
});

export const getPendingMeetingsCount = createAsyncThunk('meeting/getPendingCount', async () => {
  const response = await api.get('/meetings/pending/count');
  return response.data;
});

export const createMeeting = createAsyncThunk('meeting/create', async (data, thunkAPI) => {
  try {
    const response = await api.post('/meetings', data);
    Swal.fire({
      icon: 'success',
      title: 'Meeting Created!',
      text: 'Invitations have been sent to participants',
    });
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.error || error.message,
    });
    return thunkAPI.rejectWithValue(error.response?.data?.error);
  }
});

export const respondToMeeting = createAsyncThunk('meeting/respond', async ({ id, status }) => {
  const response = await api.put(`/meetings/${id}/respond`, { status });
  return response.data;
});

export const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMeetings.pending, (state) => { state.isLoading = true; })
      .addCase(getMeetings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meetings = action.payload.data;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.meetings.unshift(action.payload.data);
      })
      .addCase(getPendingMeetingsCount.fulfilled, (state, action) => {
        state.pendingCount = action.payload.data;
      });
  },
});

export default meetingSlice.reducer;

