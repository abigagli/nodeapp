FROM node:12-alpine


RUN adduser -D -h /nodeapp nodebuild
WORKDIR /nodeapp
ADD --chown=nodebuild:nodebuild ./ /nodeapp
USER nodebuild
RUN npm ci

EXPOSE 3333

USER node
CMD ["npm", "run" ,"start-prod"]
