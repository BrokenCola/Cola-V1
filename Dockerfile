# Use the official lightweight Bun image
FROM oven/bun:alpine

WORKDIR /usr/src/app

# Copy dependency files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the source files
COPY . .

# Create the data directory for the SQLite database
RUN mkdir -p data

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=2000

# Expose the server port
EXPOSE 2000

# Run migrations and start the server
CMD ["bun", "run", "start:prod"]
