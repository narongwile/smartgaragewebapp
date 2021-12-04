# Build AdonisJS
FROM node:16-alpine as builder
# Set directory for all files
WORKDIR /home/nrkwine/smartgaragewebapp
# Copy over package.json files
COPY package*.json ./
# Install all packages
RUN npm install -g npm@8.2.0
RUN npm install uuid@7.0.3 --force
RUN npm install
# Copy over source code
COPY . .
# Build AdonisJS for production
RUN npm run build --production


# Build final runtime container
FROM node:16-alpine
# Set environment variables
ENV NODE_ENV=production
# Disable .env file loading
ENV ENV_SILENT=true
# Listen to external network connections
# Otherwise it would only listen in-container ones
ENV HOST=0.0.0.0
# Set port to listen
ENV PORT=3333
# Set home dir
WORKDIR /home/nrkwine/smartgaragewebapp
# Copy over built files
COPY --from=builder /home/nrkwine/smartgaragewebapp/build .
# Install only required packages
RUN npm ci --production
# Expose port to outside world
EXPOSE 3333
# Start server up
CMD [ "node", "server.js" ]