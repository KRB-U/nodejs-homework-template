FROM node

WORKDIR /app

COPY . /app

RUN npm install 

RUN npm rebuild bcrypt --build-from-source

EXPOSE 3000

CMD ["node", "server.js"]