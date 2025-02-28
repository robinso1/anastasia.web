import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { socket } from '../../services/socket';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Получение списка задач с фильтрацией и пагинацией
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async ({ filters = {}, page = 1, limit = 10 }, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(`${API_URL}/tasks`, {
      params: {
        ...filters,
        page,
        limit,
      },
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
  }
);

// Создание новой задачи
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { getState, dispatch }) => {
    const { auth } = getState();
    const response = await axios.post(`${API_URL}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    
    // Отправляем уведомление через WebSocket
    socket.emit('task_created', {
      task: response.data,
      user: auth.user
    });
    
    return response.data;
  }
);

// Обновление задачи
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData, notifyUsers = true }, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    
    if (notifyUsers) {
      socket.emit('task_updated', {
        task: response.data,
        user: auth.user
      });
    }
    
    return response.data;
  }
);

// Удаление задачи
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { getState }) => {
    const { auth } = getState();
    await axios.delete(`${API_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    return taskId;
  }
);

// Добавление комментария к задаче
export const addTaskComment = createAsyncThunk(
  'tasks/addComment',
  async ({ taskId, comment }, { getState }) => {
    const { auth } = getState();
    const response = await axios.post(
      `${API_URL}/tasks/${taskId}/comments`,
      { content: comment },
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      }
    );
    
    socket.emit('task_comment_added', {
      task_id: taskId,
      comment: response.data,
      user: auth.user
    });
    
    return response.data;
  }
);

// Изменение статуса задачи
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ taskId, status, comment }, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(
      `${API_URL}/tasks/${taskId}/status`,
      { status, comment },
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      }
    );
    
    socket.emit('task_status_changed', {
      task: response.data,
      user: auth.user,
      previous_status: status
    });
    
    return response.data;
  }
);

// Назначение исполнителей
export const assignTask = createAsyncThunk(
  'tasks/assign',
  async ({ taskId, userIds }, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(
      `${API_URL}/tasks/${taskId}/assign`,
      { user_ids: userIds },
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      }
    );
    
    socket.emit('task_assigned', {
      task: response.data,
      user: auth.user,
      assigned_users: userIds
    });
    
    return response.data;
  }
);

// Добавление наблюдателей
export const addTaskWatchers = createAsyncThunk(
  'tasks/addWatchers',
  async ({ taskId, userIds }, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(
      `${API_URL}/tasks/${taskId}/watchers`,
      { user_ids: userIds },
      {
        headers: { Authorization: `Bearer ${auth.token}` }
      }
    );
    return response.data;
  }
);

// Прикрепление файлов
export const attachFiles = createAsyncThunk(
  'tasks/attachFiles',
  async ({ taskId, files }, { getState }) => {
    const { auth } = getState();
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await axios.post(
      `${API_URL}/tasks/${taskId}/attachments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }
);

// Экспорт задач
export const exportTasks = createAsyncThunk(
  'tasks/export',
  async ({ format, filters }, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(
      `${API_URL}/tasks/export`,
      {
        params: { format, ...filters },
        headers: { Authorization: `Bearer ${auth.token}` },
        responseType: 'blob'
      }
    );
    
    // Создаем URL для скачивания файла
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tasks_export.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return url;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    status: 'idle',
    error: null,
    filters: {
      status: null,
      priority: null,
      assignee: null,
      dueDate: null,
      search: '',
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
    selectedTask: null,
    taskComments: {},
    taskAttachments: {},
    taskHistory: {},
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        status: null,
        priority: null,
        assignee: null,
        dueDate: null,
        search: '',
      };
    },
    // Обработка WebSocket событий
    taskUpdated: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    taskCommentAdded: (state, action) => {
      const { taskId, comment } = action.payload;
      if (!state.taskComments[taskId]) {
        state.taskComments[taskId] = [];
      }
      state.taskComments[taskId].push(comment);
    },
    taskStatusChanged: (state, action) => {
      const { taskId, status, history } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = status;
        if (!state.taskHistory[taskId]) {
          state.taskHistory[taskId] = [];
        }
        state.taskHistory[taskId].push(history);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение задач
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload.tasks;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Создание задачи
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        state.pagination.total += 1;
      })
      // Обновление задачи
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Удаление задачи
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.pagination.total -= 1;
      })
      // Добавление комментария
      .addCase(addTaskComment.fulfilled, (state, action) => {
        const { taskId, comment } = action.payload;
        if (!state.taskComments[taskId]) {
          state.taskComments[taskId] = [];
        }
        state.taskComments[taskId].push(comment);
      })
      // Прикрепление файлов
      .addCase(attachFiles.fulfilled, (state, action) => {
        const { taskId, attachments } = action.payload;
        if (!state.taskAttachments[taskId]) {
          state.taskAttachments[taskId] = [];
        }
        state.taskAttachments[taskId].push(...attachments);
      });
  },
});

export const {
  setFilters,
  setPagination,
  setSelectedTask,
  clearFilters,
  taskUpdated,
  taskCommentAdded,
  taskStatusChanged,
} = tasksSlice.actions;

export default tasksSlice.reducer;
