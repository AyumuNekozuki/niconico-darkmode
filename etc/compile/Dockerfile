FROM --platform=linux/x86_64 node:14-stretch

WORKDIR /app


COPY ./gulpfile.js /app/gulpfile.js
COPY ./package.json /app/package.json

RUN npm install

CMD npx gulp