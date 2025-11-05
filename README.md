# Ridge Portfolio Site

A modern portfolio website built with Next.js, designed for deployment on Unraid using Docker containers.

## Architecture

- **Framework**: Next.js with static export
- **Styling**: Tailwind CSS
- **Deployment**: Docker container on Unraid
- **Reverse Proxy**: SWAG (nginx + Let's Encrypt)
- **CI/CD**: GitHub Actions → Docker Hub → Manual Unraid deployment

## Local Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Docker Deployment

### Build Image Locally
```bash
docker build -t ridge-site .
docker run -p 3000:80 ridge-site
```

### Unraid Setup

1. **Install from Docker Hub**
   - Repository: `[your-dockerhub-username]/ridge-site:latest`
   - Container Port: 80
   - Host Port: 3001 (or your preferred port)

2. **SWAG Configuration**
   Create `/mnt/user/appdata/swag/nginx/site-confs/ridgeserver.subdomain.conf`:
   ```nginx
   server {
       listen 443 ssl;
       listen [::]:443 ssl;
       
       server_name ridgeserver.com www.ridgeserver.com;
       
       include /config/nginx/ssl.conf;
       
       location / {
           include /config/nginx/proxy.conf;
           resolver 127.0.0.11 valid=30s;
           set $upstream_app ridge-site;
           set $upstream_port 80;
           proxy_pass http://$upstream_app:$upstream_port;
       }
   }
   ```

## CI/CD Pipeline

The GitHub Actions workflow automatically:
1. Builds the Next.js application
2. Creates a Docker image
3. Pushes to Docker Hub

To deploy updates on Unraid:
1. Stop the existing container
2. Pull the latest image
3. Start the container with the same configuration

## Environment Variables

No environment variables are required for basic operation.

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/             # Global styles
├── types/              # TypeScript definitions
├── Dockerfile          # Container definition
└── next.config.mjs     # Next.js configuration
```

## Docker Configuration

The Dockerfile uses a multi-stage build:
1. **deps**: Install dependencies with pnpm
2. **builder**: Build the Next.js static export
3. **runner**: Serve with nginx

The final image is optimized for production with proper caching headers and security configurations.