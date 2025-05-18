import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLessons, getLessonById, createLesson as createLessonApi } from '../api/lessonApi';

// Async thunks
export const fetchLessons = createAsyncThunk(
  'lessons/fetchLessons',
  async ({ page = 1, pageSize = 10, filters = '', level, category, status_id }, { rejectWithValue }) => {
    try {
      const response = await getLessons({ 
        page, 
        pageSize, 
        filters, 
        level, 
        category, 
        status_id 
      });
      return {
        data: Array.isArray(response?.data?.data?.data) ? response?.data?.data?.data : [],
        total: response?.data?.data?.total || 0,
        totalPages: response?.data?.data?.totalPages || 0
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLessonById = createAsyncThunk(
  'lessons/fetchLessonById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getLessonById(id);
      return response.data?.data?.data[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk tạo bài học mới
export const createLesson = createAsyncThunk(
  'lessons/createLesson',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createLessonApi(data);
      // Trả về dữ liệu bài học mới (nếu backend trả về)
      return response.data?.data || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Lỗi khi tạo bài học');
    }
  }
);

const initialState = {
  lessons: [],
  currentLesson: null,
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,
  filters: {
    page: 0,
    pageSize: 10,
    filters: '',
    id: null,
    category: '',
    level: null
  }
};

const lessonSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentLesson: (state) => {
      state.currentLesson = null;
    },
    filterByCategory: (state, action) => {
      state.filters.category = action.payload;
      state.filters.page = 0;
    },
    filterByLevel: (state, action) => {
      state.filters.level = action.payload;
      state.filters.page = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch lessons
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lessons = [];
        state.total = 0;
        state.totalPages = 0;
      })
      // Fetch lesson by id
      .addCase(fetchLessonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLesson = action.payload;
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentLesson = null;
      })
      .addCase(createLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.loading = false;
        // Push bài học mới vào đầu danh sách
        if (action.payload) {
          state.lessons = [action.payload, ...state.lessons];
        }
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setFilters, 
  clearFilters, 
  clearCurrentLesson,
  filterByCategory,
  filterByLevel 
} = lessonSlice.actions;

export default lessonSlice.reducer;
