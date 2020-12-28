FROM node:14-alpine AS nodebuilder

# Add a label to make it easier removing intermediate
# images with a command like
# docker rmi -f $(docker images -q --filter label=stage=intermediate)
LABEL stage=intermediate

# Take the private SSH key to use for git clone
# as a build argument
# when using docker-compose, you can just do
# GIT_SSH_KEY=$(< ~/.ssh/fwaserver_id_rsa) docker-compose up --build
ARG SSH_KEY

# Install dependencies
RUN apk add --no-cache \
python3 \
make \
gcc \
g++ \
boost-dev \
snappy-dev \
libpng-dev \
git \
openssh

RUN adduser -D -h /nodeapp nodebuild
WORKDIR /nodeapp
USER nodebuild

# 1. Create the SSH directory.
# 2. Populate the private key file.
# 3. Set the required permissions.
# 4. Add github to our list of known hosts for ssh.
RUN mkdir -p .ssh/ && \
    echo "$SSH_KEY" > .ssh/id_rsa && \
    chmod -R 600 .ssh/id_rsa && \
    ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

RUN git clone git@github.com:eandreini/hdrbil.git

ADD --chown=nodebuild:nodebuild package*.json binding.gyp /nodeapp/
ADD --chown=nodebuild:nodebuild app /nodeapp/app
ADD --chown=nodebuild:nodebuild cppsrc /nodeapp/cppsrc
#ADD --chown=nodebuild:nodebuild hdrbil /nodeapp/hdrbil

RUN npm ci && \
# release build is done automatically during 'npm ci',
# so we can keep this commented out
#npm run build && \
npm run build:debug


FROM node:14-alpine AS servicerunner

# Reinstall runtime dependencies of the native hdrbil addon
RUN apk add --no-cache \
boost \
snappy \
libpng

WORKDIR /nodeapp

COPY --from=nodebuilder /nodeapp/package*.json ./
COPY --from=nodebuilder /nodeapp/app ./app
COPY --from=nodebuilder /nodeapp/build ./build
COPY --from=nodebuilder /nodeapp/node_modules ./node_modules

EXPOSE 8333

USER node
CMD ["npm", "run" ,"start"]
