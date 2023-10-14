#!/bin/sh

npx sequelize-cli db:create
npx sequelize-cli db:migrate
node dist/src/app.js
