FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["node", "cli.js"]

# Cria a pasta de trabalho dentro do container
# Copia apenas os arquivos de dependência primeiro
# Instala as dependências
# Copia o restante do projeto
# Define o comando de entrada. 