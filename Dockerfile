FROM node:20

# Set working directory
WORKDIR /src

# Copy dependency files
COPY package*.json ./

# Copy Prisma schema before install (needed for postinstall hook)
COPY prisma ./prisma/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all other source files
COPY . .



# Expose Next.js dev port
EXPOSE 3000

# Run the dev server
CMD ["npm", "run", "dev"]
