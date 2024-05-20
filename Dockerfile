FROM node:18

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run doc

RUN npm run tests

EXPOSE 3000

EXPOSE 8080

HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
