FROM node:8@sha256:f10c8218e3f92b513af9120f5eda5fed35b651343f940881d696b958cc16ab43
WORKDIR /srv/www
EXPOSE 3000
ENTRYPOINT npm start

# make node_modules cached.
# Src: https://nodesource.com/blog/8-protips-to-start-killing-it-when-dockerizing-node-js/
#
COPY package.json package-lock.json ./
RUN npm install

# Setup environment for client/server build and server execution
#
ARG BUILD_TARGET
ENV NODE_ENV=production BUILD_TARGET=${BUILD_TARGET}

# Other files, so that other files do not interfere with node_modules cache
#
COPY . .

# Generate .next, which includes absolute path to package so it must be done
# within container.
#
RUN npm run build:next
