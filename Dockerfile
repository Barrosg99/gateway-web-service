# Use uma imagem base com Node.js
FROM node:20.17-alpine

# Configure o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências e instale-as
COPY package*.json ./
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Compilar a aplicação NestJS
RUN npm run build

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
