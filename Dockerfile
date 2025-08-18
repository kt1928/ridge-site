# Multi-stage build for optimal size
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm run build

FROM nginx:alpine AS runner
WORKDIR /app

# Copy static build
COPY --from=builder /app/out /usr/share/nginx/html

# Next.js specific nginx config
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    
    # Next.js static files
    location /_next/static {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Main app
    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]