FROM node:lts-alpine3.17
WORKDIR /usr/src/app

EXPOSE 3000

COPY . ./

RUN npm install 
RUN npm run build

ENTRYPOINT [ "/bin/sh" ]
CMD [ "entrypoint.sh" ]

