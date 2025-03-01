import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Расширяем интерфейс Request для добавления userId и userRole
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

// Middleware для проверки аутентификации
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Токен авторизации не предоставлен' });
    }

    // Формат заголовка: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Неверный формат токена' });
    }

    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key') as any;
    
    // Добавляем данные пользователя в запрос
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    return res.status(401).json({ message: 'Недействительный токен' });
  }
};

// Middleware для проверки роли пользователя
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Нет доступа' });
    }

    next();
  };
}; 