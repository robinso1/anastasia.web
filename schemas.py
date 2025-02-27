from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models import TaskStatus

class UserBase(BaseModel):
    """Базовая модель пользователя"""
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    """Создание нового пользователя"""
    password: str

class UserLogin(BaseModel):
    """Данные для входа"""
    email: EmailStr
    password: str

class User(UserBase):
    """Модель пользователя"""
    id: int
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    """Базовая модель задачи"""
    title: str
    description: str
    date: datetime

class TaskCreate(TaskBase):
    """Создание новой задачи"""
    pass

class TaskUpdate(BaseModel):
    """Обновление задачи"""
    status: TaskStatus

class Task(TaskBase):
    """Модель задачи"""
    id: int
    status: TaskStatus
    created_at: datetime
    user_id: int
    
    class Config:
        from_attributes = True
