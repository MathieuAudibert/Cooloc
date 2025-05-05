FROM node:20-alpine
WORKDIR /app

COPY frontend/package*.json ./
RUN rm -rf node_modules
RUN npm install 

COPY frontend/ .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "dev"]
