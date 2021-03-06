# ---- Base Node ----
FROM node:carbon AS base
# Create app directory
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# install app dependencies including 'devDependencies'
RUN npm install --ignore-scripts --unsafe-perm

# ---- Copy Files/Build ----
FROM dependencies AS build
WORKDIR /app
COPY . /app
RUN npm run build

# --- Release with Alpine ----
FROM node:8.9-alpine AS release
RUN npm install -g pm2
# Create app directory
WORKDIR /app
# optional
COPY --from=dependencies /app/package.json ./
# Install app dependencies
RUN npm install --only=production --ignore-scripts --unsafe-perm

COPY --from=build /app/dist ./
CMD ["pm2", "start", "--name", "city_list", "--no-daemon", "server.js]
