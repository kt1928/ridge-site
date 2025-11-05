import { NextRequest, NextResponse } from 'next/server';
import type { MonitorStatus, DeviceStatus } from '@/types/device';

// Simple in-memory cache
interface CacheEntry {
  data: MonitorStatus[];
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL = 30000; // 30 seconds

/**
 * Fetches monitor status from Uptime Kuma
 * This is a placeholder implementation - configure with your Kuma instance
 */
async function fetchKumaStatus(monitorIds: string[]): Promise<MonitorStatus[]> {
  const kumaBaseUrl = process.env.UPTIME_KUMA_URL;
  const kumaApiKey = process.env.UPTIME_KUMA_API_KEY;

  if (!kumaBaseUrl) {
    console.warn('UPTIME_KUMA_URL not configured, returning mock data');
    // Return mock data for development
    return monitorIds.map(id => ({
      monitorId: id,
      state: (Math.random() > 0.3 ? 'online' : Math.random() > 0.5 ? 'offline' : 'unknown') as DeviceStatus,
    }));
  }

  try {
    // Example: Fetch from Uptime Kuma API
    // Adjust this based on your Kuma setup (could be /api/status-page or /api/push)
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (kumaApiKey) {
      headers['Authorization'] = `Bearer ${kumaApiKey}`;
    }

    const response = await fetch(`${kumaBaseUrl}/api/monitors`, {
      headers,
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`Kuma API returned ${response.status}`);
    }

    const data = await response.json();

    // Map Kuma response to our format
    // This structure depends on your Kuma API response
    return monitorIds.map(id => {
      const monitor = data.monitors?.find((m: any) => m.id === id || m.monitorID === id);

      let state: DeviceStatus = 'unknown';
      if (monitor) {
        // Kuma typically uses: 0 = down, 1 = up, 2 = pending
        if (monitor.status === 1 || monitor.active === 1) {
          state = 'online';
        } else if (monitor.status === 0 || monitor.active === 0) {
          state = 'offline';
        }
      }

      return {
        monitorId: id,
        state,
      };
    });
  } catch (error) {
    console.error('Error fetching Kuma status:', error);
    // Return unknown status on error
    return monitorIds.map(id => ({
      monitorId: id,
      state: 'unknown' as DeviceStatus,
    }));
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json(
        { error: 'Missing "ids" query parameter' },
        { status: 400 }
      );
    }

    const monitorIds = idsParam.split(',').filter(Boolean);

    if (monitorIds.length === 0) {
      return NextResponse.json([]);
    }

    // Check cache
    const now = Date.now();
    if (cache && now - cache.timestamp < CACHE_TTL) {
      // Filter cached data for requested IDs
      const filteredData = cache.data.filter(m => monitorIds.includes(m.monitorId));

      // If we have all requested monitors in cache, return from cache
      if (filteredData.length === monitorIds.length) {
        return NextResponse.json(filteredData, {
          headers: {
            'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
          },
        });
      }
    }

    // Fetch fresh data
    const statuses = await fetchKumaStatus(monitorIds);

    // Update cache with all monitors
    cache = {
      data: statuses,
      timestamp: now,
    };

    return NextResponse.json(statuses, {
      headers: {
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error in monitors API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monitor status' },
      { status: 500 }
    );
  }
}
