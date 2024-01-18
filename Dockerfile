# Що поставити; що запустить проект
FROM node

# Робоча дирикторія
WORKDIR /app

# копія файлів проекту звідки > куда
COPY . /app

# запуск команд на виконання - інсталяцій node модулів
RUN npm install 

# номер порту на якому буде висіти проект
EXPOSE 3001

# команди для запуску проекту
CMD ["node", 'app']