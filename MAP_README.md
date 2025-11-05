# NYC Homelab Map - Setup Guide

A Nord-themed interactive map of NYC homelab devices with real-time status monitoring via Uptime Kuma.

## Features

- **Interactive Map**: Nord-themed map with dark tiles centered on NYC
- **Device Markers**: Color-coded markers (green=online, red=offline, amber=unknown)
- **Clustering**: Automatic marker clustering for better performance
- **Real-time Status**: Integration with Uptime Kuma for live device monitoring
- **Admin Interface**: Add, edit, and delete devices via `/admin/map`
- **SWR Caching**: Client-side data caching with 30-60s refresh intervals

## Routes

- **Public Map**: `/map` - Interactive map visible to all users
- **Admin Panel**: `/admin/map` - Protected device management interface

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Admin Authentication (Basic Auth)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# Uptime Kuma Integration
UPTIME_KUMA_URL=https://kuma.example.com
UPTIME_KUMA_API_KEY=your-kuma-api-key

# Optional: Client-side admin credentials (for demo)
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
```

### 2. Uptime Kuma Configuration

The map integrates with Uptime Kuma to show real-time device status.

#### Option A: Direct API Integration

1. Set `UPTIME_KUMA_URL` to your Kuma instance URL
2. Set `UPTIME_KUMA_API_KEY` if your Kuma requires authentication
3. Update `/app/api/status/monitors/route.ts` to match your Kuma API response format

#### Option B: Status Page API

If you're using Kuma's public status page:

```typescript
// In /app/api/status/monitors/route.ts
const response = await fetch(`${kumaBaseUrl}/api/status-page/${statusPageSlug}`);
```

#### Monitor ID Mapping

Each device in the system can have a `monitorId` field that corresponds to a monitor in Uptime Kuma:

```json
{
  "id": "queens-node-1",
  "name": "Queens-Node-1",
  "monitorId": "kuma-123",  // <- Links to Kuma monitor
  ...
}
```

### 3. Device Data Storage

Devices are stored in `data/devices.json` (v1) with the following structure:

```json
[
  {
    "id": "queens-node-1",
    "name": "Queens-Node-1",
    "type": "Proxmox Node",
    "os": "Proxmox VE 8.2",
    "lat": 40.72800,
    "lng": -73.86300,
    "status": "unknown",
    "monitorId": "kuma-123",
    "url": "https://proxmox.example.local"
  }
]
```

**Required fields**: `id`, `name`, `type`, `os`, `lat`, `lng`, `status`
**Optional fields**: `monitorId`, `url`

### 4. Adding Devices

#### Via Admin UI

1. Navigate to `/admin/map`
2. Authenticate with admin credentials (default: `admin/admin`)
3. Click "Add Device"
4. Fill in the form:
   - **Name**: Human-readable device name
   - **Type**: Device type (e.g., "Proxmox Node", "Web Server")
   - **OS**: Operating system
   - **Lat/Lng**: Geographic coordinates (5 decimal places for ~1m precision)
   - **Monitor ID**: (Optional) Uptime Kuma monitor identifier
   - **URL**: (Optional) Management interface URL

#### Via API

```bash
# Create device
curl -X POST http://localhost:3000/api/devices \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4=" \
  -d '{
    "name": "Brooklyn-Web-1",
    "type": "Web Server",
    "os": "Ubuntu 22.04 LTS",
    "lat": 40.65940,
    "lng": -73.93320,
    "monitorId": "kuma-124",
    "url": "https://web1.example.local"
  }'

# Update device
curl -X PATCH http://localhost:3000/api/devices/brooklyn-web-1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4=" \
  -d '{"os": "Ubuntu 24.04 LTS"}'

# Delete device
curl -X DELETE http://localhost:3000/api/devices/brooklyn-web-1 \
  -H "Authorization: Basic YWRtaW46YWRtaW4="
```

### 5. Finding Lat/Lng Coordinates

Use one of these methods to find coordinates:

1. **Google Maps**: Right-click on location → "What's here?" → Copy coordinates
2. **OpenStreetMap**: Click location → See "Lat, Lon" in URL
3. **geocode.xyz**: Search for address and get coordinates

For privacy, you can add jitter (±0.0007°) to coordinates in the future by setting `JITTER_ENABLED=true`.

## API Endpoints

### Public Endpoints

- `GET /api/devices` - List all devices
- `GET /api/devices/:id` - Get specific device
- `GET /api/status/monitors?ids=id1,id2` - Get monitor statuses (cached 30s)

### Admin Endpoints (Auth Required)

- `POST /api/devices` - Create device
- `PATCH /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device

## Nord Theme Colors

The map uses the Nord color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| nord0 | `#2E3440` | Background |
| nord1 | `#3B4252` | Popups, UI elements |
| nord2 | `#434C5E` | Borders, subtle backgrounds |
| nord3 | `#4C566A` | Borders |
| nord4 | `#D8DEE9` | Labels |
| nord5 | `#E5E9F0` | Values |
| nord6 | `#ECEFF4` | Primary text |
| nord7 | `#8FBCBB` | Link hover |
| nord8 | `#88C0D0` | Links, primary actions |
| nord11 | `#BF616A` | Offline/error |
| nord13 | `#EBCB8B` | Unknown status |
| nord14 | `#A3BE8C` | Online/success |

## Caching Strategy

- **Devices**: 60s client-side cache (SWR)
- **Monitor Status**: 30s server-side + client-side cache
- **Stale-While-Revalidate**: Shows cached data while fetching fresh data

## Authentication

### Current Implementation (v1)

- Basic Auth with username/password
- Default: `admin/admin`
- Set via environment variables

### Production Recommendations (v2)

Replace Basic Auth with one of:

1. **Authelia**: Forward auth with LDAP/AD integration
2. **Authentik**: Modern SSO with OAuth2/OIDC
3. **Next-Auth**: Built-in Next.js authentication
4. **Cloudflare Access**: Zero-trust authentication

## Keyboard Navigation

The map supports keyboard navigation:

- **Tab**: Focus on markers
- **Enter**: Open popup
- **Arrow keys**: Pan map
- **+/-**: Zoom in/out
- **Esc**: Close popup

## Troubleshooting

### Map not loading

- Check browser console for errors
- Verify Leaflet CSS is loaded
- Ensure client-side rendering (`'use client'` directive)

### Status not updating

- Check `UPTIME_KUMA_URL` is correct
- Verify monitor IDs match Kuma monitors
- Check browser network tab for API errors
- Review server logs for cache issues

### Authentication failing

- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars
- Check Authorization header format
- Try `admin/admin` defaults

### Devices not appearing

- Verify `data/devices.json` exists and is valid JSON
- Check file permissions (must be readable/writable)
- Review API endpoint responses

## Migration to SQLite/Prisma (Future v2)

To migrate from JSON to database:

1. Install Prisma: `pnpm add prisma @prisma/client`
2. Create schema in `prisma/schema.prisma`
3. Update `/lib/devices-storage.ts` to use Prisma
4. Keep API shape identical for backwards compatibility

## Performance Optimization

- Marker clustering reduces DOM nodes on low zoom
- In-memory caching prevents excessive Kuma API calls
- SWR provides efficient client-side data management
- Dark map tiles reduce eye strain and match Nord theme

## Security Considerations

- Store admin credentials in environment variables, never in code
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Consider API key rotation for Kuma integration
- Add CORS protection for production deployments

## License

MIT
