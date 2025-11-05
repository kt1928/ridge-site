'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import type { Device, MonitorStatus } from '@/types/device';
import { NYCHomelabMap } from './nyc-homelab-map';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function MapClient() {
  const [devicesWithStatus, setDevicesWithStatus] = useState<Device[]>([]);

  // Fetch devices with 60s revalidation
  const { data: devices, error: devicesError } = useSWR<Device[]>(
    '/api/devices',
    fetcher,
    {
      refreshInterval: 60000, // 60s
      revalidateOnFocus: false,
    }
  );

  // Get all monitor IDs from devices
  const monitorIds = devices
    ?.filter((d) => d.monitorId)
    .map((d) => d.monitorId!)
    .join(',');

  // Fetch monitor statuses with 30s revalidation
  const { data: statuses } = useSWR<MonitorStatus[]>(
    monitorIds ? `/api/status/monitors?ids=${monitorIds}` : null,
    fetcher,
    {
      refreshInterval: 30000, // 30s
      revalidateOnFocus: false,
    }
  );

  // Merge device data with status
  useEffect(() => {
    if (!devices) return;

    const statusMap = new Map(
      statuses?.map((s) => [s.monitorId, s.state]) || []
    );

    const merged = devices.map((device) => ({
      ...device,
      status: device.monitorId
        ? statusMap.get(device.monitorId) || 'unknown'
        : 'unknown',
    }));

    setDevicesWithStatus(merged);
  }, [devices, statuses]);

  if (devicesError) {
    return (
      <div className="map-container flex items-center justify-center">
        <div className="text-nord-11">Error loading devices: {devicesError.message}</div>
      </div>
    );
  }

  if (!devices) {
    return (
      <div className="map-container flex items-center justify-center">
        <div className="text-nord-6">Loading devices...</div>
      </div>
    );
  }

  return <NYCHomelabMap devices={devicesWithStatus} />;
}
