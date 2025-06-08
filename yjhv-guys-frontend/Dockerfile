# Используем официальный образ Node.js
FROM node:18

# Указываем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходные файлы
COPY . .

# Экспортируем порт (обычно 5173 для Vite)
EXPOSE 5173

# Запускаем локальный сервер
CMD ["npm", "run", "dev"]