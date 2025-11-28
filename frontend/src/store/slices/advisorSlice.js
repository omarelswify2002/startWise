import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

const initialState = {
  advisors: [],
  advisor: null,
  myAdvisor: null,
  isLoading: false,
};

export const getAdvisors = createAsyncThunk('advisor/getAll', async (params) => {
  const response = await api.get('/advisors', { params });
  console.log('Advisors:', response);
  return response.data;
});

export const getAdvisor = createAsyncThunk('advisor/getOne', async (_id) => {
  const response = await api.get(`/advisors/${_id}`);
  console.log('Advisor:', response);
  return response.data;
});

export const createAdvisor = createAsyncThunk('advisor/create', async (data) => {
  const response = await api.post('/advisors', data);
  console.log('Advisor created:', response);
  return response.data;
});

export const updateAdvisor = createAsyncThunk('advisor/update', async ({ _id, data }) => {
  const response = await api.put(`/advisors/${_id}`, data);
  console.log('Advisor updated:', response);
  return response.data;
});

export const getMyAdvisor = createAsyncThunk('advisor/getMyAdvisor', async (userId) => {
  const response = await api.get(`/advisors/user/${userId}`);
  console.log('My advisor profile:', response);
  return response.data;
});

export const advisorSlice = createSlice({
  name: 'advisor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdvisors.pending, (state) => { state.isLoading = true; })
      .addCase(getAdvisors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.advisors = action.payload.data;
      })
      .addCase(getAdvisor.fulfilled, (state, action) => {
        state.advisor = action.payload.data;
      })
      .addCase(createAdvisor.fulfilled, (state, action) => {
        state.myAdvisor = action.payload.data;
      })
      .addCase(updateAdvisor.fulfilled, (state, action) => {
        state.myAdvisor = action.payload.data;
      })
      .addCase(getMyAdvisor.fulfilled, (state, action) => {
        state.myAdvisor = action.payload.data;
      });
  },
});

export default advisorSlice.reducer;

