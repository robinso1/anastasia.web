import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const router = Router();

// Маршрут для входа
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Проверка наличия email и пароля
    if (!email || !password) {
      return res.status(400).json({ message: 'Необходимо указать email и пароль' });
    }

    // Поиск пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Если пользователь не найден
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '24h' }
    );

    // Отправка ответа с данными пользователя и токеном
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
});

// Маршрут для регистрации (для администратора)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Проверка наличия необходимых полей
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    // Проверка, существует ли пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'JUNIOR_MANAGER',
      },
    });

    // Создание JWT токена
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '24h' }
    );

    // Отправка ответа с данными пользователя и токеном
    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

// Маршрут для получения информации о текущем пользователе
router.get('/me', async (req: Request, res: Response) => {
  try {
    // Получение userId из запроса (будет добавлен middleware)
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    // Поиск пользователя по ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Отправка данных пользователя
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router; 