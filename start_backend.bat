@echo off
chcp 65001 > nul
echo Запуск сервера...

cd backend

REM Проверка наличия node_modules
if not exist node_modules (
    echo Установка зависимостей...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Ошибка установки зависимостей
        pause
        exit /b 1
    )
)

REM Проверка работы PostgreSQL
echo Проверка подключения к базе данных...
psql -U postgres -d planner -c "\q" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ОШИБКА: Не удалось подключиться к базе данных
    echo Убедитесь, что:
    echo 1. PostgreSQL запущен
    echo 2. База данных 'planner' существует
    echo 3. Пароль в файле .env корректный
    pause
    exit /b 1
)

REM Компиляция TypeScript
echo Компиляция TypeScript...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Ошибка компиляции
    pause
    exit /b 1
)

REM Запуск сервера
echo Запуск сервера в режиме разработки...
call npm run dev
