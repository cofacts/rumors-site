FROM kkarczmarczyk/node-yarn:6.9
WORKDIR /srv/www

# make node_modules cached.
# Src: https://nodesource.com/blog/8-protips-to-start-killing-it-when-dockerizing-node-js/
#
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile

# server.js seldom changes, but requires to be built within docker
# to make its path correct
#
COPY server.js .babelrc ./
RUN NODE_ENV=production npm run build:server

# Other files, so that other files do not interfere with node_modules cache
#
COPY . .

# Generate .next, which includes absolute path to package so it must be done
# within container.
#
RUN NODE_ENV=production npm run build:next

EXPOSE 3000

ENTRYPOINT npm start
