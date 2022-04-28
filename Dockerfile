FROM node:16 AS builder
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

# Generate storybook files
RUN npm run build-storybook -- -c .storybook/ -o public/storybook/

# Generate .next, which includes absolute path to package so it must be done
# within container.
#
RUN npm run build

RUN npm prune --production

#########################################
FROM node:16-stretch-slim

WORKDIR /srv/www
EXPOSE 3000

# Note: using npm start here will cause error when exiting the container
CMD ["node_modules/.bin/pm2-runtime", "ecosystem.config.js"]

COPY package.json package-lock.json next.config.js ecosystem.config.js server.js ./
COPY --from=builder /srv/www/.next ./.next
COPY --from=builder /srv/www/public ./public
COPY --from=builder /srv/www/node_modules ./node_modules
