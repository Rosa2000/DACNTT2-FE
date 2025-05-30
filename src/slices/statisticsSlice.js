import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserGrowth } from '../api/statisticsApi';
import { getUsers } from '../api/userApi';

export const fetchDashboardStatistics = createAsyncThunk(
  'statistics/fetchDashboardStatistics',
  async (params) => {
    const [userResponse, growthResponse] = await Promise.all([
      getUsers(params),
      getUserGrowth(params.selectedMonths)
    ]);
    return {
      users: userResponse.data,
      growth: growthResponse.data
    };
  }
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState: {
    loading: false,
    error: null,
    dashboardData: {
      totalUsers: 0,
      latestUsers: [],
      userGrowth: [],
      totalNewUsers: 0
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStatistics.fulfilled, (state, action) => {
        state.loading = false;
        const { users, growth } = action.payload;
        
        if (users.code === 0) {
          state.dashboardData.totalUsers = users.total;
          state.dashboardData.latestUsers = users.data;
        }
        
        if (growth.code === 0) {
          const rawData = growth.data.monthlyData;
          state.dashboardData.userGrowth = rawData
            .map((item) => ({
              ...item,
              value: Number(item.value)
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
          state.dashboardData.totalNewUsers = growth.data.totalNewUsers;
        }
      })
      .addCase(fetchDashboardStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default statisticsSlice.reducer; 