import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import lessonReducer from '../slices/lessonSlice';
import exerciseReducer from '../slices/exerciseSlice';
import userManagementReducer from '../slices/userSlice';
import statisticsReducer from '../slices/statisticsSlice';

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['auth'], // chỉ persist reducer auth
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    lessons: lessonReducer,
    exercises: exerciseReducer,
    userManagement: userManagementReducer,
    statistics: statisticsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Bỏ qua kiểm tra tính tuần tự cho redux-persist
    }),
});

let persistor = persistStore(store);

export { store, persistor };