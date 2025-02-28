import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tasksReducer from './slices/tasksSlice';
import messagesReducer from './slices/messagesSlice';
import knowledgeBaseReducer from './slices/knowledgeBaseSlice';
import workloadReducer from './slices/workloadSlice';
import reportsReducer from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    messages: messagesReducer,
    knowledgeBase: knowledgeBaseReducer,
    workload: workloadReducer,
    reports: reportsReducer,
  },
});
