FROM node:18-alpine AS build
WORKDIR /app/cooloc

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app/cooloc

COPY --from=build /app/cooloc/dist ./dist

COPY package.json package-lock.json ./
RUN npm install --production

COPY vite.config.js ./

EXPOSE 8080
CMD ["npm", "run", "preview"]