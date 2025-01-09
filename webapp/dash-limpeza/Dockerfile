# Etapa 1: Construção da aplicação Vue.js
FROM node:20 as builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Construir a aplicação para produção
RUN npm run build

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:stable-alpine

# Copiar os arquivos do build para o diretório padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando padrão para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]




