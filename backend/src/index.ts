import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

// Импорт маршрутов
import healthRouter from './routes/health';

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения
const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Настройка CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка директории для загрузок
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Маршруты
app.use('/api/health', healthRouter);

// Настройка Socket.IO
const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Обработка подключений Socket.IO
io.on('connection', (socket) => {
  console.log('Новое подключение:', socket.id);

  socket.on('disconnect', () => {
    console.log('Отключение:', socket.id);
  });
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Фронтенд URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

// Обработка необработанных исключений
process.on('unhandledRejection', (error) => {
  console.error('Необработанное исключение:', error);
});

export { prisma }; 