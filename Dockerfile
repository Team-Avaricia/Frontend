# Stage 1: Build
FROM node:20.19-alpine as build-stage

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies - delete package-lock and regenerate for Linux compatibility
RUN rm -f package-lock.json && npm install

# Copy the rest of the code
COPY . .

# Build arguments (Vite needs this at build time)
ARG VITE_AUTH_API_URL
ARG VITE_MAIN_API_URL

# Set environment variables for the build process
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_MAIN_API_URL=$VITE_MAIN_API_URL

# Build the application for production
RUN npm run build

# Stage 2: Nginx server for production
FROM nginx:alpine as production-stage

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy files generated in build stage to Nginx folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]