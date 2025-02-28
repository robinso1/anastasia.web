@echo off
chcp 65001 > nul
echo Запуск клиентского приложения...

cd frontend

REM Проверка наличия node_modules
if not exist node_modules (
    echo Установка зависимостей...
    call npm install --legacy-peer-deps
    if %ERRORLEVEL% NEQ 0 (
        echo Ошибка установки зависимостей
        pause
        exit /b 1
    )
)

REM Проверка доступности сервера
echo Проверка доступности сервера...
curl -f http://localhost:5000/api/health >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ВНИМАНИЕ: Сервер недоступен!
    echo Убедитесь, что:
    echo 1. Запущен start_backend.bat
    echo 2. Сервер успешно стартовал
    echo.
    set /p CONTINUE=Продолжить запуск клиента? (y/n): 
    if /i not "%CONTINUE%"=="y" exit /b 1
)

REM Запуск клиента
echo Запуск клиентского приложения...
echo Приложение будет доступно по адресу: http://localhost:3000
call npm start
