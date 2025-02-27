from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Планировщик задач",
    description="API для управления задачами"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя"""
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    """Вход в систему"""
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    return {"message": "Успешный вход"}

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    """Получение списка задач"""
    tasks = db.query(models.Task).all()
    return tasks

@app.post("/tasks")
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    """Создание новой задачи"""
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    """Обновление задачи"""
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    for key, value in task.dict().items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Удаление задачи"""
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    db.delete(db_task)
    db.commit()
    return {"message": "Задача удалена"}
