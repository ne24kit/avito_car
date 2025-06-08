# Используем базовый образ Python
FROM python:3.13.0-slim

# Установка рабочего каталога внутри контейнера
WORKDIR /app

# Копируем requirements.txt для установки зависимостей
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем остальные файлы проекта
COPY . .

# Указываем порт, который будет открыт в контейнере
EXPOSE 8082

# Команда для запуска приложения
CMD ["python", "src/main.py"]