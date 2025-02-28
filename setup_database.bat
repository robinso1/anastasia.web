@echo off
chcp 65001 > nul
echo Создание базы данных для Планировщика задач...

set PGPASSWORD=postgres
psql -U postgres -c "CREATE DATABASE planner;"

echo База данных успешно создана!
pause
