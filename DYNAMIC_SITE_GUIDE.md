# Dynamic Website Setup Guide for Unraid

## Option 1: Next.js with API Routes (Recommended Start)

### 1. Create New Project
```bash
# Create new directory
mkdir /mnt/user/my-dynamic-site
cd /mnt/user/my-dynamic-site

# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --app
```

### 2. Docker Setup
```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/package*.json ./
COPY --from=base /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

### 3. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  my-dynamic-site:
    build: .
    container_name: my-dynamic-site
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - /mnt/user/appdata/my-dynamic-site/data:/app/data
    restart: unless-stopped
```

### 4. SWAG Configuration
```nginx
# /mnt/user/appdata/swag/nginx/site-confs/my-app.subdomain.conf
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    
    server_name my-app.ridgeserver.com;
    
    include /config/nginx/ssl.conf;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    location / {
        include /config/nginx/proxy.conf;
        resolver 127.0.0.11 valid=30s;
        set $upstream_app my-dynamic-site;
        set $upstream_port 3000;
        set $upstream_proto http;
        proxy_pass $upstream_proto://$upstream_app:$upstream_port;
        
        # WebSocket support for development
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API routes
    location /api/ {
        include /config/nginx/proxy.conf;
        resolver 127.0.0.11 valid=30s;
        set $upstream_app my-dynamic-site;
        set $upstream_port 3000;
        proxy_pass http://$upstream_app:$upstream_port;
    }
}
```

## Option 2: WordPress (Easiest CMS)

### 1. Unraid Community Apps
- Search for "WordPress" in Community Apps
- Install the LinuxServer.io WordPress container
- Configure domain: `blog.ridgeserver.com`

### 2. SWAG Configuration
```nginx
# /mnt/user/appdata/swag/nginx/site-confs/wordpress.subdomain.conf
server {
    listen 443 ssl;
    server_name blog.ridgeserver.com;
    
    include /config/nginx/ssl.conf;
    
    location / {
        include /config/nginx/proxy.conf;
        resolver 127.0.0.11 valid=30s;
        set $upstream_app wordpress;
        set $upstream_port 80;
        proxy_pass http://$upstream_app:$upstream_port;
    }
}
```

## Option 3: Full-Stack with Database

### 1. Complete Stack
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    container_name: fullstack-app
    ports:
      - "3002:3000"
    environment:
      - DATABASE_URL=postgresql://myuser:mypass@db:5432/myapp
      - JWT_SECRET=your-secret-key
    depends_on:
      - db
    restart: unless-stopped
    
  db:
    image: postgres:15
    container_name: fullstack-db
    environment:
      - POSTGRES_USER=myuser
      - POSTGRES_PASSWORD=mypass
      - POSTGRES_DB=myapp
    volumes:
      - /mnt/user/appdata/fullstack-app/db:/var/lib/postgresql/data
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    container_name: fullstack-redis
    volumes:
      - /mnt/user/appdata/fullstack-app/redis:/data
    restart: unless-stopped
```

## GitHub Actions for Dynamic Sites

### 1. Build and Deploy Workflow
```yaml
# .github/workflows/deploy-dynamic.yml
name: Deploy Dynamic Site

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: |
          docker build -t my-dynamic-site .
          
      - name: Deploy to Unraid
        run: |
          # Copy files to Unraid
          # Restart container
          # Run database migrations if needed
```

## Subdomain Strategy

### Organize Multiple Sites
- **Static**: `ridgeserver.com` (your current site)
- **Blog**: `blog.ridgeserver.com` (WordPress)
- **App**: `app.ridgeserver.com` (Dynamic web app)
- **API**: `api.ridgeserver.com` (Backend services)
- **Admin**: `admin.ridgeserver.com` (Admin panels)

## Security Considerations

### 1. Environment Variables
```bash
# Store secrets in docker-compose
environment:
  - DATABASE_PASSWORD_FILE=/run/secrets/db_password
  - JWT_SECRET_FILE=/run/secrets/jwt_secret
```

### 2. Network Isolation
```yaml
networks:
  app-network:
    driver: bridge
    
services:
  app:
    networks:
      - app-network
  db:
    networks:
      - app-network
```

### 3. SWAG Authentication
```nginx
# Add to any location block
include /config/nginx/authelia-location.conf;  # If using Authelia
# or
auth_basic "Restricted";
auth_basic_user_file /config/nginx/.htpasswd;
```

## Backup Strategy

### 1. Database Backups
```bash
# Automated database backup script
docker exec fullstack-db pg_dump -U myuser myapp > /mnt/user/backups/app-db-$(date +%Y%m%d).sql
```

### 2. Application Data
```bash
# Backup application files
tar -czf /mnt/user/backups/app-data-$(date +%Y%m%d).tar.gz /mnt/user/appdata/my-app/
``` 