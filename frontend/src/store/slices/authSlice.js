import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';
import Swal from 'sweetalert2';

// Get user from localStorage with error handling
let user = null;
let token = null;

try {
  const userStr = localStorage.getItem('user');
  if (userStr && userStr !== 'undefined' && userStr !== 'null') {
    user = JSON.parse(userStr);
  }
  const tokenStr = localStorage.getItem('token');
  if (tokenStr && tokenStr !== 'undefined' && tokenStr !== 'null') {
    token = tokenStr;
  }
} catch (error) {
  console.error('Error reading from localStorage:', error);
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

const initialState = {
  user: user || null,
  token: token || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Welcome to StartWise System',
          timer: 2000,
        });
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: message,
      });
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', userData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome back, ${response.data.user.name}`,
          timer: 2000,
        });
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: message,
      });
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  Swal.fire({
    icon: 'success',
    title: 'Logged Out',
    text: 'You have been logged out successfully',
    timer: 1500,
  });
});

// Get current user
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      Swal.fire({
        icon: 'success',
        title: 'OTP Sent!',
        text: 'Please check your email for the OTP code',
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

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, thunkAPI) => {
    try {
      const response = await api.post('/auth/reset-password', data);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful!',
          text: 'You can now login with your new password',
        });
      }
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

// Update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, thunkAPI) => {
    try {
      const response = await api.put('/auth/update-profile', data);
      console.log('Profile updated:', response.data);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          timer: 1500,
        });
      }
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

export const authSlice = createSlice({
  name: 'auth',
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
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        console.log("User data:", action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      // Get Me
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.data;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;

