# ─────────────────────────────────────────────
# Stage 1: Dependencies
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies (use --legacy-peer-deps to match CI behaviour)
RUN npm ci --legacy-peer-deps

# ─────────────────────────────────────────────
# Stage 2: Build / Lint / Typecheck
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source code
COPY . .

# Run lint and typecheck (mirrors the CI pipeline)
RUN npm run lint && npx tsc --noEmit

# ─────────────────────────────────────────────
# Stage 3: Dev Server (Expo)
# ─────────────────────────────────────────────
FROM node:20-alpine AS dev

# Install Expo CLI globally
RUN npm install -g expo-cli@latest

WORKDIR /app

# Copy source and installed modules
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Expose Expo dev server ports
# 8081 – Metro bundler
# 19000 – Expo Go / tunnel
# 19001 – Expo DevTools
EXPOSE 8081 19000 19001

# Start the Expo dev server (web mode works in Docker; mobile needs tunnel)
CMD ["npx", "expo", "start", "--web", "--host", "lan"]
