import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserById, updateUser, updateUserPassword } from '../api/userApi';

// Async thunk để lấy thông tin profile người dùng
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await getUserById(userId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải thông tin người dùng');
    }
  }
);

// Async thunk để cập nhật thông tin cá nhân
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await updateUser(userId, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật thông tin thất bại');
    }
  }
);

// Async thunk để cập nhật mật khẩu
export const updateUserPasswordProfile = createAsyncThunk(
  'profile/updateUserPassword',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await updateUserPassword(userId, data);
      return response.data.message || 'Đổi mật khẩu thành công!'; // Thường chỉ trả về message
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null, // Lưu thông tin profile
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    successMessage: null,
  },
  reducers: {
    clearProfileMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
        state.successMessage = null;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload; // Cập nhật lại data với thông tin mới
        state.successMessage = 'Cập nhật thông tin thành công!';
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.successMessage = null;
      })
      // Update password
      .addCase(updateUserPasswordProfile.pending, (state) => {
        state.status = 'loading';
        state.successMessage = null;
        state.error = null;
      })
      .addCase(updateUserPasswordProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload || 'Đổi mật khẩu thành công!';
        state.error = null;
      })
      .addCase(updateUserPasswordProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.successMessage = null;
      });
  },
});

export const { clearProfileMessages } = profileSlice.actions;

export const selectProfile = (state) => state.profile.data;
export const selectProfileStatus = (state) => state.profile.status;

export default profileSlice.reducer; 