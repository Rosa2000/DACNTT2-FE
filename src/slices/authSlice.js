import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, verifyLogin, register, forgotPassword } from '../api/authApi';

export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await login(username, password);
      console.log('Login response:', response.data); // Debug
      // Backend trả về trực tiếp { user, accessToken }
      const userData = response.data;
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
      }
      return userData;
    } catch (error) {
      console.log('Login error:', error.response?.data); // Debug
      if (error.response?.status === 401) {
        return rejectWithValue(error.response.data.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
      }
      if (error.response?.status === 500) {
        return rejectWithValue(error.response.data.message || 'Lỗi server, vui lòng thử lại sau');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

export const registerUserAsync = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await register(formData);
      console.log('Register response:', response.data); // Debug
      // Backend trả về dữ liệu user trực tiếp
      return response.data || {};
    } catch (error) {
      console.log('Register error:', error.response?.data); // Debug
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

export const forgotPasswordRequestAsync = createAsyncThunk(
  'auth/forgotPasswordRequest',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await forgotPassword({ email });
      console.log('Forgot password response:', response.data); // Debug
      // Backend trả về dữ liệu trực tiếp
      return response.data.message || 'Email khôi phục đã được gửi!';
    } catch (error) {
      console.log('Forgot password error:', error.response?.data); // Debug
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
      console.log('Verify login response:', response.data); // Debug
      return response.data || {};
    } catch (error) {
      console.log('Verify login error:', error.response?.data); // Debug
      if (error.response?.status === 401) {
        return rejectWithValue('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      }
      if (error.response?.status === 500) {
        return rejectWithValue(error.response.data.message || 'Lỗi server, vui lòng thử lại sau');
      }
      return rejectWithValue(error.message || 'Lỗi kết nối đến server');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
    successMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user || action.payload;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
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
      .addCase(forgotPasswordRequestAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPasswordRequestAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = action.payload;
        state.error = null;
      })
      .addCase(forgotPasswordRequestAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.successMessage = null;
      })
      .addCase(verifyLoginAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyLoginAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(verifyLoginAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;