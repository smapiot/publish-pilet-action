FROM node:slim

COPY . .

RUN npm install --only=production

ENTRYPOINT ["node", "/index.js"]
