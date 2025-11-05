# Ridge Site Unraid Deployment Guide

## Overview

This guide covers deploying the Ridge Portfolio Site on Unraid using Docker containers with SWAG as a reverse proxy.

## Prerequisites

- Unraid server with Docker support
- SWAG container already configured
- Domain name pointing to your server
- Docker Hub account (for automated deployments)

## Deployment Steps

### 1. Install Ridge Site Container

**Via Unraid WebUI:**
1. Go to Docker tab
2. Click "Add Container"
3. Fill in the following:
   - **Name**: `ridge-site`
   - **Repository**: `[your-dockerhub-username]/ridge-site:latest`
   - **Network Type**: `bridge`
   - **Port Mappings**: 
     - Container Port: `80`
     - Host Port: `3001` (or your preferred port)

**Via Docker Command:**
```bash
docker run -d \
  --name=ridge-site \
  --restart=unless-stopped \
  -p 3001:80 \
  [your-dockerhub-username]/ridge-site:latest
```

### 2. Configure SWAG Reverse Proxy

Create the nginx configuration file:
**File**: `/mnt/user/appdata/swag/nginx/site-confs/ridgeserver.subdomain.conf`

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    
    server_name ridgeserver.com www.ridgeserver.com;
    
    include /config/nginx/ssl.conf;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    location / {
        include /config/nginx/proxy.conf;
        resolver 127.0.0.11 valid=30s;
        set $upstream_app ridge-site;
        set $upstream_port 80;
        proxy_pass http://$upstream_app:$upstream_port;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        include /config/nginx/proxy.conf;
        resolver 127.0.0.11 valid=30s;
        set $upstream_app ridge-site;
        set $upstream_port 80;
        proxy_pass http://$upstream_app:$upstream_port;
        
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name ridgeserver.com www.ridgeserver.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. Restart SWAG

After creating the configuration file:
```bash
docker restart swag
```

## Updating the Site

### Automatic Updates (Recommended)

The GitHub Actions workflow automatically builds and pushes new images to Docker Hub when you push to the main branch.

To deploy updates:
1. Stop the ridge-site container
2. Remove the old container
3. Pull the latest image
4. Start a new container

**Update Script:**
```bash
#!/bin/bash
docker stop ridge-site
docker rm ridge-site
docker pull [your-dockerhub-username]/ridge-site:latest
docker run -d \
  --name=ridge-site \
  --restart=unless-stopped \
  -p 3001:80 \
  [your-dockerhub-username]/ridge-site:latest
```

### Manual Updates

If you need to build locally:
```bash
# Build new image
docker build -t ridge-site .

# Stop and remove old container
docker stop ridge-site
docker rm ridge-site

# Start new container
docker run -d \
  --name=ridge-site \
  --restart=unless-stopped \
  -p 3001:80 \
  ridge-site
```

## Troubleshooting

### Container Won't Start
```bash
# Check container logs
docker logs ridge-site

# Check if port is in use
netstat -tulpn | grep :3001
```

### Site Not Accessible
1. Verify container is running: `docker ps`
2. Check SWAG logs: `docker logs swag`
3. Test direct container access: `curl http://localhost:3001`
4. Verify nginx configuration syntax: `docker exec swag nginx -t`

### SSL Certificate Issues
1. Check SWAG logs for Let's Encrypt errors
2. Ensure ports 80 and 443 are forwarded to your server
3. Verify domain DNS is pointing to your server IP

## Monitoring

### Health Checks
```bash
# Check container status
docker ps | grep ridge-site

# Check resource usage
docker stats ridge-site

# View recent logs
docker logs ridge-site --tail 50
```

### Backup Considerations

The ridge-site container is stateless, so no data backup is needed. The source code is backed up in GitHub, and images are stored in Docker Hub.

For SWAG configuration backup:
```bash
# Backup SWAG config
tar -czf swag-backup-$(date +%Y%m%d).tar.gz /mnt/user/appdata/swag/
```

## Security Notes

- The container runs nginx on port 80 internally
- All external traffic should go through SWAG (HTTPS)
- No sensitive data is stored in the container
- Regular updates are handled through the CI/CD pipeline

## Performance Optimization

- Static assets are cached for 1 year
- Gzip compression is handled by SWAG
- The Docker image is optimized with multi-stage builds
- Consider using Cloudflare for additional CDN caching