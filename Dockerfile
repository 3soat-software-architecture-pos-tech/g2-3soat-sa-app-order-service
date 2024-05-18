FROM node:18

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run doc

EXPOSE 3000

EXPOSE 80

HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost/ || exit 1


