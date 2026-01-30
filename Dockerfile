# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/tokens/package.json ./packages/tokens/
COPY packages/ui/package.json ./packages/ui/
COPY apps/docliQ-mobile/package.json ./apps/docliQ-mobile/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY packages/ ./packages/
COPY apps/docliQ-mobile/ ./apps/docliQ-mobile/

# Build packages first (tokens -> ui -> app)
RUN pnpm --filter @meda/tokens build
RUN pnpm --filter @meda/ui build
# Run vite build directly (skip tsc type-check for faster builds)
RUN cd apps/docliQ-mobile && pnpm exec vite build

# Production stage - serve static files with nginx
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/apps/docliQ-mobile/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
