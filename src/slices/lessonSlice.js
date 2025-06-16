import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getLessons, 
  getLessonById, 
  createLesson as createLessonApi,
  studyLesson as studyLessonApi,
  getUserLessons
} from '../api/lessonApi';

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
      return response.data?.data || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Lỗi khi tạo bài học');
    }
  }
);

// Thunk đánh dấu bài học đã học
export const studyLesson = createAsyncThunk(
  'lessons/study',
  async (studyData, { rejectWithValue }) => {
    try {
      const response = await studyLessonApi(studyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Lỗi khi đánh dấu bài học');
    }
  }
);

export const fetchUserLessons = createAsyncThunk(
  'lessons/fetchUserLessons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserLessons();
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  lessons: [],
  currentLesson: null,
  lastLesson: null,
  userLessons: [],
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
    },
    setLastLesson: (state, action) => {
      state.lastLesson = action.payload;
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
        
        if (action.payload.data && action.payload.data.length > 0) {
          const sortedLessons = [...action.payload.data].sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          );
          state.lastLesson = sortedLessons[0];
        }
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
      })
      .addCase(studyLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(studyLesson.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(studyLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserLessons.fulfilled, (state, action) => {
        state.userLessons = action.payload;
      });
  }
});

export const { 
  setFilters, 
  clearFilters, 
  clearCurrentLesson,
  filterByCategory,
  filterByLevel,
  setLastLesson
} = lessonSlice.actions;

export default lessonSlice.reducer;
