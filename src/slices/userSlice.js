import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers, deleteUser, restoreUser } from '../api/userApi';
import { getUserGrowth } from '../api/statisticsApi';

export const fetchUsers = createAsyncThunk(
  'userManagement/fetchUsers',
  async (params) => {
    const response = await getUsers(params);
    return response.data;
  }
);

export const deleteUserAction = createAsyncThunk(
  'userManagement/deleteUser',
  async (id) => {
    await deleteUser(id);
    return { id };
  }
);

export const restoreUserAction = createAsyncThunk(
  'userManagement/restoreUser',
  async (id) => {
    await restoreUser(id);
    return { id };
  }
);

export const fetchDashboardData = createAsyncThunk(
  'userManagement/fetchDashboardData',
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

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState: {
    users: [],
    loading: false,
    error: null,
    total: 0,
    totalPages: 0,
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUserAction.fulfilled, (state, action) => {
        const userIndex = state.users.findIndex(user => user.id === action.payload.id);
        if (userIndex !== -1) {
          state.users[userIndex].status_id = 2;
        }
      })
      .addCase(restoreUserAction.fulfilled, (state, action) => {
        const userIndex = state.users.findIndex(user => user.id === action.payload.id);
        if (userIndex !== -1) {
          state.users[userIndex].status_id = 1;
        }
      })
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
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
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default userManagementSlice.reducer; 