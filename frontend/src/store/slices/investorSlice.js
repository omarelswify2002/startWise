import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

const initialState = {
  investors: [],
  investor: null,
  myInvestor: null,
  isLoading: false,
};

export const getInvestors = createAsyncThunk('investor/getAll', async (params) => {
  const response = await api.get('/investors', { params });
  console.log('Investors:', response);
  return response.data;
});

export const getInvestor = createAsyncThunk('investor/getOne', async (_id) => {
  const response = await api.get(`/investors/${_id}`);
  console.log('Investor:', response);
  return response.data;
});

export const createInvestor = createAsyncThunk('investor/create', async (data) => {
  const response = await api.post('/investors', data);
  console.log('Investor created:', response);
  return response.data;
});

export const updateInvestor = createAsyncThunk('investor/update', async ({ _id, data }) => {
  const response = await api.put(`/investors/${_id}`, data);
  console.log('Investor updated:', response);
  return response.data;
});

export const getMyInvestor = createAsyncThunk('investor/getMyInvestor', async (userId) => {
  const response = await api.get(`/investors/user/${userId}`);
  console.log('My investor profile:', response);
  return response.data;
});

export const investorSlice = createSlice({
  name: 'investor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInvestors.pending, (state) => { state.isLoading = true; })
      .addCase(getInvestors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investors = action.payload.data;
      })
      .addCase(getInvestor.fulfilled, (state, action) => {
        state.investor = action.payload.data;
      })
      .addCase(createInvestor.fulfilled, (state, action) => {
        state.myInvestor = action.payload.data;
      })
      .addCase(updateInvestor.fulfilled, (state, action) => {
        state.myInvestor = action.payload.data;
      })
      .addCase(getMyInvestor.fulfilled, (state, action) => {
        state.myInvestor = action.payload.data;
      });
  },
});

export default investorSlice.reducer;
