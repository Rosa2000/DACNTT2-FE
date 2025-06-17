import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getExercises, createExercise as createExerciseApi, getExercisesByLessonId, doExercise, updateExercise as updateExerciseApi } from '../api/exerciseApi';

export const fetchExercises = createAsyncThunk(
  'exercises/fetchExercises',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getExercises(params);
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

export const createExercise = createAsyncThunk(
  'exercises/createExercise',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createExerciseApi(data);
      return response.data?.data || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Lỗi khi tạo bài tập');
    }
  }
);

export const fetchExerciseById = createAsyncThunk(
  'exercises/fetchExerciseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getExercises({ id });
      return response.data?.data?.data[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchExercisesByLessonId = createAsyncThunk(
  'exercises/fetchByLessonId',
  async (lessonId) => {
    const response = await getExercisesByLessonId(lessonId);
    return response.data?.data?.data || [];
  }
);

export const updateExercise = createAsyncThunk(
  'exercises/updateExercise',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateExerciseApi(id, data);
      return response.data?.data || data;
    } catch (error) {
      return rejectWithValue(error.message || 'Lỗi khi cập nhật bài tập');
    }
  }
);

export const submitExerciseResults = createAsyncThunk(
  'exercises/submitResults',
  async ({ results, userId }, { rejectWithValue }) => {
    try {
      const response = await doExercise(results, userId);
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  exercises: [],
  currentExercise: null,
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,
};

const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    clearCurrentExercise: (state) => {
      state.currentExercise = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.exercises = [];
        state.total = 0;
        state.totalPages = 0;
      })
      .addCase(createExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.exercises = [action.payload, ...state.exercises];
          state.total += 1;
        }
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchExerciseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExerciseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExercise = action.payload;
      })
      .addCase(fetchExerciseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentExercise = null;
      })
      .addCase(fetchExercisesByLessonId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExercisesByLessonId.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload;
      })
      .addCase(fetchExercisesByLessonId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(submitExerciseResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitExerciseResults.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitExerciseResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentExercise } = exerciseSlice.actions;
export default exerciseSlice.reducer;
