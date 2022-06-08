# Build AdonisJS
FROM node:16-alpine as builder
# Set directory for all files
WORKDIR .
# Copy over package.json files
COPY package*.json ./
# Install all packages
RUN rm -rf node_modules && rm -rf package-lock.json && npm instal
RUN npm update
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
ENV CACHE_VIEWS=true

# Set home dir
WORKDIR .
# Copy over built files
COPY --from=builder ./build .
# Install only required packages
RUN npm ci --production
# Expose port to outside world
EXPOSE 3333
# Start server up
CMD [ "node", "server.js" ]
