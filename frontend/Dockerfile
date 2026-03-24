FROM node:20-alpine

WORKDIR /app

# Copia e instala dependências Node
COPY package*.json ./
RUN npm install

# Copia o código
COPY . .

EXPOSE 3000
