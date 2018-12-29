FROM node:8@sha256:09cf39a09c227a0c4f8df7b864fb1c32462166669172628f86cb45d87e7aac2f
WORKDIR /srv/www
EXPOSE 3000
ENTRYPOINT npm start

# make node_modules cached.
# Src: https://nodesource.com/blog/8-protips-to-start-killing-it-when-dockerizing-node-js/
#
COPY package.json package-lock.json ./
RUN npm install

# Other files, so that other files do not interfere with node_modules cache
#
COPY . .

# Generate .next, which includes absolute path to package so it must be done
# within container.
#
RUN npm run build:next
