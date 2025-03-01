import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Начало инициализации базы данных...');

    // Проверяем, существует ли уже пользователь-администратор
    const adminExists = await prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });

    if (!adminExists) {
      // Создаем пользователя-администратора
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = await prisma.user.create({
        data: {
          email: 'admin@freestyle.ru',
          password: hashedPassword,
          firstName: 'Администратор',
          lastName: 'Системы',
          role: 'ADMIN',
        },
      });
      
      console.log('Создан пользователь-администратор:', admin.email);
    } else {
      console.log('Пользователь-администратор уже существует');
    }

    // Создаем тестового менеджера, если его еще нет
    const managerExists = await prisma.user.findFirst({
      where: {
        email: 'manager@freestyle.ru',
      },
    });

    if (!managerExists) {
      const hashedPassword = await bcrypt.hash('manager123', 10);
      
      const manager = await prisma.user.create({
        data: {
          email: 'manager@freestyle.ru',
          password: hashedPassword,
          firstName: 'Иван',
          lastName: 'Петров',
          role: 'MANAGER',
        },
      });
      
      console.log('Создан тестовый менеджер:', manager.email);
    }

    // Создаем тестового младшего менеджера, если его еще нет
    const juniorExists = await prisma.user.findFirst({
      where: {
        email: 'junior@freestyle.ru',
      },
    });

    if (!juniorExists) {
      const hashedPassword = await bcrypt.hash('junior123', 10);
      
      const junior = await prisma.user.create({
        data: {
          email: 'junior@freestyle.ru',
          password: hashedPassword,
          firstName: 'Алексей',
          lastName: 'Сидоров',
          role: 'JUNIOR_MANAGER',
        },
      });
      
      console.log('Создан тестовый младший менеджер:', junior.email);
    }

    console.log('Инициализация базы данных завершена успешно');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 