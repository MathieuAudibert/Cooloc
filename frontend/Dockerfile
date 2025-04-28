FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app

COPY --from=build /app/dist ./dist

COPY package.json package-lock.json ./
RUN npm install --production

COPY vite.config.js ./
RUN npm install vite

EXPOSE 8080
CMD ["npm", "run", "preview"]