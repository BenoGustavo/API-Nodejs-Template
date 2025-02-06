# Use the official Node.js image as the base image
FROM node:22 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Use a smaller base image for the runtime
FROM node:22-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy only the built files and necessary dependencies
COPY --from=build /usr/src/app/package.json /usr/src/app/yarn.lock ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/swagger.yaml ./swagger.yaml

# Expose the port the app runs on
EXPOSE 3333

# Command to run the application
CMD ["yarn", "start"]