FROM node:20.2

WORKDIR /app

COPY . . 

RUN npm install

ARG NEXT_TELEMETRY_DISABLED 1
ARG NODE_ENV production

EXPOSE 3000

CMD npm run build && npm run start
