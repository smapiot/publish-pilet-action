FROM node:slim

COPY . .

RUN npm install

ENTRYPOINT ["node", "/index.js"]
