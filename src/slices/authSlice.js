import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  login,
  loginWithGoogle,
  // logout,
  forgotPassword,
  register,
  verifyLogin,
} from '../api/authApi';

// const getRoleFromUserGroup = (user) => {
//   const groupId = user?.user_group?.[0]?.group_id;
//   console.log('User group ID:', groupId); // Debug
//   if (groupId === 1) return 'admin';
//   if (groupId === 2) return 'user';
//   return 'unknown';
// };

export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await login(username, password);
      if (response.data.code === 0 && response.data.data?.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken);
        return response.data.data; // Trả về { user, accessToken }
      }
      return rejectWithValue(response.data.message || 'Đăng nhập thất bại');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi kết nối đến server');
    }
  }
);

export const registerUserAsync = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await register(formData);
      // Backend trả về dữ liệu user trực tiếp
      return response.data || {};
    } catch (error) {
      if (error.response?.status === 400) {
        return rejectWithValue(error.response.data.message || 'Thông tin không hợp lệ');
      }
      if (error.response?.status === 409) {
        return rejectWithValue(error.response.data.message || 'Email hoặc tên đăng nhập đã tồn tại');
      }
      if (error.response?.status === 500) {
        return rejectWithValue(error.response.data.message || 'Lỗi server, vui lòng thử lại sau');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await forgotPassword({ email });
      // Backend trả về dữ liệu trực tiếp
      return response.data.message || 'Email khôi phục đã được gửi!';
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue(error.response.data.message || 'Email không tồn tại');
      }
      if (error.response?.status === 500) {
        return rejectWithValue(error.response.data.message || 'Lỗi server, vui lòng thử lại sau');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const verifyLoginAsync = createAsyncThunk(
  'auth/verifyLogin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await verifyLogin();
      if (response.data.code === 0 && response.data.data) {
        return response.data.data; // Trả về thông tin user
      }
      return rejectWithValue(response.data.message || 'Không xác thực được');
    } catch (error) {
      if (error.response?.status === 401 || error.response?.data?.code === -3) {
        return rejectWithValue('Phiên đăng nhập hết hạn hoặc không có quyền');
      }
      return rejectWithValue(error.response?.data?.message || 'Lỗi kết nối đến server');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    role: null,
    status: 'idle',
    error: null,
    successMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
      localStorage.removeItem('token');
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý đăng nhập
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user || action.payload;
        state.isAuthenticated = true;
        // Xác định role dựa trên user_group
        const groupId = action.payload.user?.user_group?.[0]?.group_id;
        state.role = groupId === 1 ? 'admin' : groupId === 2 ? 'user' : 'unknown';
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Xử lý đăng ký tài khoản
      .addCase(registerUserAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Xử lý quên mật khẩu
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload;
        state.error = null;
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.successMessage = null;
      })
      // Xử lý xác thực đăng nhập
      .addCase(verifyLoginAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyLoginAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = !!action.payload && Object.keys(action.payload).length > 0;
        // Xác định role dựa trên user_group
        const groupId = action.payload?.user_group?.[0]?.group_id;
        state.role = groupId === 1 ? 'admin' : groupId === 2 ? 'user' : 'unknown';
        state.error = null;
      })
      .addCase(verifyLoginAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;