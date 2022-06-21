FROM node:16-slim

COPY . .

RUN npm install --only=production

ENTRYPOINT ["node", "/index.js"]
