import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { fetchTasks, createTask, updateTask } from '../../store/slices/tasksSlice';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ruLocale from 'date-fns/locale/ru';

const priorities = [
  { value: 'low', label: 'Низкий', color: 'success' },
  { value: 'medium', label: 'Средний', color: 'warning' },
  { value: 'high', label: 'Высокий', color: 'error' },
];

const statuses = [
  { value: 'planned', label: 'Запланировано' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'completed', label: 'Выполнено' },
];

export default function TaskList() {
  const dispatch = useDispatch();
  const { tasks, status } = useSelector((state) => state.tasks);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    date: new Date(),
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      date: new Date(),
    });
  };

  const handleCreateTask = async () => {
    try {
      await dispatch(createTask(newTask)).unwrap();
      handleClose();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await dispatch(updateTask({
        taskId,
        taskData: { status: newStatus }
      })).unwrap();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DatePicker
            label="Выберите дату"
            value={selectedDate}
            onChange={setSelectedDate}
            renderInput={(params) => <TextField {...params} />}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Добавить задачу
          </Button>
        </Box>

        <Grid container spacing={3}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} key={task.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{task.title}</Typography>
                    <Chip
                      label={priorities.find(p => p.value === task.priority)?.label}
                      color={priorities.find(p => p.value === task.priority)?.color}
                    />
                  </Box>
                  <Typography color="textSecondary" sx={{ mb: 2 }}>
                    {task.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControl size="small">
                      <InputLabel>Статус</InputLabel>
                      <Select
                        value={task.status}
                        label="Статус"
                        onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                      >
                        {statuses.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {task.status === 'completed' && task.result && (
                      <Typography color="textSecondary">
                        Результат: {task.result}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Новая задача</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Название"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Описание"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Приоритет</InputLabel>
              <Select
                value={newTask.priority}
                label="Приоритет"
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DatePicker
              label="Дата"
              value={newTask.date}
              onChange={(newDate) => setNewTask({ ...newTask, date: newDate })}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={handleCreateTask} variant="contained">
              Создать
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
