import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';
import Swal from 'sweetalert2';

const initialState = {
  matches: [],
  match: null,
  isLoading: false,
  isGenerating: false,
};

export const generateMatches = createAsyncThunk('match/generate', async (startupId, thunkAPI) => {
  try {
    const response = await api.post('/matches/generate', { startupId });
    console.log('Matches generated:', response);

    // After generating, fetch the saved matches from database
    const matchesResponse = await api.get(`/matches/${startupId}`);
    console.log('Fetched saved matches:', matchesResponse);

    Swal.fire({
      icon: 'success',
      title: 'Matches Generated!',
      text: `Found ${response.data.data.totalMatches} potential matches`,
    });

    // Return the fetched matches instead of the generation response
    return matchesResponse.data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.error || error.message,
    });
    return thunkAPI.rejectWithValue(error.response?.data?.error);
  }
});

export const getMatches = createAsyncThunk('match/getAll', async (startupId, thunkAPI) => {
  try {
    // Handle both string and object parameters
    const id = typeof startupId === 'object' ? startupId.startupId : startupId;
    const params = typeof startupId === 'object' ? startupId.params : undefined;

    console.log('Fetching matches for startup ID:', id);
    const response = await api.get(`/matches/${id}`, { params });
    console.log('Matches:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const getMatchesForInvestor = createAsyncThunk('match/getForInvestor', async (investorId, thunkAPI) => {
  try {
    console.log('Fetching matches for investor ID:', investorId);
    const response = await api.get(`/matches/investor/${investorId}`);
    console.log('Investor matches:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching investor matches:', error);
    return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const getMatchesForAdvisor = createAsyncThunk('match/getForAdvisor', async (advisorId, thunkAPI) => {
  try {
    console.log('Fetching matches for advisor ID:', advisorId);
    const response = await api.get(`/matches/advisor/${advisorId}`);
    console.log('Advisor matches:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching advisor matches:', error);
    return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const updateMatchStatus = createAsyncThunk('match/updateStatus', async ({ _id, status, notes }) => {
  const response = await api.put(`/matches/${_id}/status`, { status, notes });
  console.log('Match status updated:', response);
  return response.data;
});

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateMatches.pending, (state) => {
        state.isGenerating = true;
      })
      .addCase(generateMatches.fulfilled, (state, action) => {
        state.isGenerating = false;
        // Update matches with the fetched matches from database
        state.matches = action.payload.data || [];
      })
      .addCase(generateMatches.rejected, (state) => {
        state.isGenerating = false;
      })
      .addCase(getMatches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload.data || [];
      })
      .addCase(getMatches.rejected, (state) => {
        state.isLoading = false;
        state.matches = [];
      })
      .addCase(getMatchesForInvestor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMatchesForInvestor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload.data || [];
      })
      .addCase(getMatchesForInvestor.rejected, (state) => {
        state.isLoading = false;
        state.matches = [];
      })
      .addCase(getMatchesForAdvisor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMatchesForAdvisor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload.data || [];
      })
      .addCase(getMatchesForAdvisor.rejected, (state) => {
        state.isLoading = false;
        state.matches = [];
      })
      .addCase(updateMatchStatus.fulfilled, (state, action) => {
        const index = state.matches.findIndex(m => m._id === action.payload.data._id);
        if (index !== -1) {
          state.matches[index] = action.payload.data;
        }
      });
  },
});

export default matchSlice.reducer;

