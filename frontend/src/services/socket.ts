import { io } from 'socket.io-client';

// Получаем URL API из переменных окружения или используем значение по умолчанию
const API_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

// Создаем экземпляр сокета
export const socket = io(API_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Функция для подключения к сокету
export const connectSocket = (token: string) => {
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
};

// Функция для отключения от сокета
export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket; 