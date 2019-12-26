FROM node:12 AS builder
WORKDIR /srv/www

# make node_modules cached.
# Src: https://nodesource.com/blog/8-protips-to-start-killing-it-when-dockerizing-node-js/
#
COPY package.json package-lock.json ./
RUN npm install

# Other files, so that other files do not interfere with node_modules cache
#
COPY . .

# These will be captured by process.env in next.config.js
ARG LOCALE=en_US
ARG APP_ID=DEV

# Generate .next, which includes absolute path to package so it must be done
# within container.
#
RUN npm run build:next

RUN npm prune --production

#########################################
FROM node:12-stretch-slim

WORKDIR /srv/www
EXPOSE 3000
ENTRYPOINT npm start

COPY package.json package-lock.json next.config.js ./
COPY --from=builder /srv/www/.next ./.next
COPY --from=builder /srv/www/node_modules ./node_modules
