# Build AdonisJS
FROM node:16-alpine as builder
# Set directory for all files
WORKDIR /home/nrkwine/smartgaragewebapp
# Copy over package.json files
COPY package*.json ./
# Install all packages
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
ENV CACHE_VIEWS=true

ENV APP_KEY=jlG45rVkU1PSx7DBngfjQ3RfozrY_kk0
ENV SESSION_DRIVER=cookie
ENV DB_CONNECTION=mssql
ENV MSSQL_SERVER=smartgaragedbserver.database.windows.net
ENV MSSQL_PORT=1433
ENV MSSQL_USER=nrkwine
ENV MSSQL_PASSWORD=NRK@wine2544
ENV MSSQL_DB_NAME=smartgaragedb
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
