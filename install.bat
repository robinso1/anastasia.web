@echo off
chcp 65001 > nul
echo Установка приложения "Планировщик"...

REM Проверка наличия Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Не найден Node.js! Пожалуйста, установите его с сайта https://nodejs.org/
    echo Требуется версия 14 или выше
    pause
    exit /b 1
)

REM Проверка наличия PostgreSQL
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Не найден PostgreSQL! Пожалуйста, установите его с сайта https://www.postgresql.org/download/windows/
    echo Требуется версия 12 или выше
    pause
    exit /b 1
)

REM Проверка и создание базы данных
echo Создание базы данных...
set /p PGPASSWORD=Введите пароль PostgreSQL (по умолчанию: postgres): 
if "%PGPASSWORD%"=="" set PGPASSWORD=postgres

createdb -U postgres planner
if %ERRORLEVEL% NEQ 0 (
    echo Ошибка создания базы данных. Проверьте, запущен ли PostgreSQL и правильность пароля.
    pause
    exit /b 1
)

REM Установка зависимостей frontend
echo Установка зависимостей клиентской части...
cd frontend
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo Ошибка установки зависимостей клиентской части
    pause
    exit /b 1
)

REM Установка зависимостей backend
echo Установка зависимостей серверной части...
cd ..\backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Ошибка установки зависимостей серверной части
    pause
    exit /b 1
)

REM Создание .env файла если он не существует
if not exist .env (
    echo Создание конфигурационного файла...
    echo DATABASE_URL="postgresql://postgres:%PGPASSWORD%@localhost:5432/planner" > .env
    echo PORT=5000 >> .env
    echo FRONTEND_URL="http://localhost:3000" >> .env
    echo JWT_SECRET="your-secret-key" >> .env
    echo UPLOAD_DIR="C:\\planner-uploads" >> .env
)

REM Инициализация Prisma и применение миграций
echo Настройка базы данных...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo Ошибка генерации Prisma клиента
    pause
    exit /b 1
)

call npx prisma migrate dev --name init
if %ERRORLEVEL% NEQ 0 (
    echo Ошибка миграции базы данных
    pause
    exit /b 1
)

REM Создание директорий для загрузок
echo Создание директорий для файлов...
mkdir "C:\planner-uploads" 2>nul
mkdir "C:\planner-uploads\documents" 2>nul
mkdir "C:\planner-uploads\knowledge-base" 2>nul
mkdir "C:\planner-uploads\messages" 2>nul

echo.
echo Установка успешно завершена!
echo.
echo Для запуска приложения:
echo 1. Запустите start_backend.bat (сервер)
echo 2. Запустите start_frontend.bat (клиент)
echo 3. Откройте браузер и перейдите по адресу http://localhost:3000
echo.
echo Примечание: при первом запуске создайте пользователя с ролью ADMIN
pause
