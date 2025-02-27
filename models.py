from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

class TaskStatus(enum.Enum):
    """Статусы задач"""
    PLANNED = "planned"  # Запланирована
    IN_PROGRESS = "in_progress"  # В работе
    COMPLETED = "completed"  # Завершена

class User(Base):
    """Пользователь системы"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    
    tasks = relationship("Task", back_populates="user")

class Task(Base):
    """Задача"""
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    status = Column(Enum(TaskStatus), default=TaskStatus.PLANNED)
    date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="tasks")
