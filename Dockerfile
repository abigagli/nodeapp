FROM node:12-alpine AS nodebuilder

RUN apk add --no-cache python3 make gcc g++ boost-dev snappy-dev
RUN adduser -D -h /nodeapp nodebuild
WORKDIR /nodeapp
ADD --chown=nodebuild:nodebuild ./ /nodeapp
USER nodebuild

RUN npm ci && \
# release build is done automatically during 'npm ci',
# so we can keep this commented out
#npm run build && \
npm run build:debug


FROM node:12-alpine AS servicerunner
WORKDIR /nodeapp

COPY --from=nodebuilder /nodeapp/package*.json ./
COPY --from=nodebuilder /nodeapp/app ./app
COPY --from=nodebuilder /nodeapp/build ./build
COPY --from=nodebuilder /nodeapp/node_modules ./node_modules

EXPOSE 8333

USER node
CMD ["npm", "run" ,"start"]
