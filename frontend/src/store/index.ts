import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import messagesReducer from './slices/messagesSlice';
import tasksReducer from './slices/tasksSlice';
import projectsReducer from './slices/projectsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    tasks: tasksReducer,
    projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 