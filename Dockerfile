FROM node:8@sha256:c55f3e9a7a2b9194e8c8c6b68b182caac02d0f6a77aacba1ebd73f6001a1c381
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
