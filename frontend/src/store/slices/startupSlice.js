import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';
import Swal from 'sweetalert2';

const initialState = {
  startups: [],
  startup: null,
  myStartup: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  totalPages: 1,
  currentPage: 1,
};

// Get all startups
export const getStartups = createAsyncThunk(
  'startup/getAll',
  async (params, thunkAPI) => {
    try {
      const response = await api.get('/startups', { params });
      console.log('Startups:', response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Get single startup
export const getStartup = createAsyncThunk(
  'startup/getOne',
  async (_id, thunkAPI) => {
    try {
      const response = await api.get(`/startups/${_id}`);
      console.log('Startup:', response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Create startup
export const createStartup = createAsyncThunk(
  'startup/create',
  async (data, thunkAPI) => {
    try {
      const response = await api.post('/startups', data);
      console.log('Startup created:', response);
      Swal.fire({
        icon: 'success',
        title: 'Startup Created!',
        text: 'Your startup profile has been created successfully',
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update startup
export const updateStartup = createAsyncThunk(
  'startup/update',
  async ({ _id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/startups/${_id}`, data);
      console.log('Startup updated:', response);
      Swal.fire({
        icon: 'success',
        title: 'Startup Updated!',
        timer: 1500,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get my startup
export const getMyStartup = createAsyncThunk(
  'startup/getMyStartup',
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/startups/user/${userId}`);
      console.log('My startup:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching my startup:', error);
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);


export const startupSlice = createSlice({
  name: 'startup',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStartups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStartups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.startups = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getStartups.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getStartup.fulfilled, (state, action) => {
        state.startup = action.payload.data;
      })
      .addCase(createStartup.fulfilled, (state, action) => {
        state.myStartup = action.payload.data;
      })
      .addCase(updateStartup.fulfilled, (state, action) => {
        state.myStartup = action.payload.data;
      })
      .addCase(getMyStartup.fulfilled, (state, action) => {
        state.myStartup = action.payload.data;
      });
  },
});

export const { reset } = startupSlice.actions;
export default startupSlice.reducer;

