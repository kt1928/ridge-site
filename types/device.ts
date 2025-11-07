export type DeviceStatus = "online" | "offline" | "unknown";

export interface Device {
  id: string;
  name: string;
  type: string;
  os: string;
  lat: number;
  lng: number;
  status: DeviceStatus;
  monitorId?: string;
  url?: string;
  // 3D Rack Visualization fields
  rackPosition?: number; // U position from bottom (1-42)
  rackHeight?: number; // Height in rack units (1U, 2U, 4U, etc.)
}

export interface MonitorStatus {
  monitorId: string;
  state: DeviceStatus;
}

export interface DeviceCreateInput {
  name: string;
  type: string;
  os: string;
  lat: number;
  lng: number;
  monitorId?: string;
  url?: string;
  rackPosition?: number;
  rackHeight?: number;
}

export interface DeviceUpdateInput {
  name?: string;
  type?: string;
  os?: string;
  lat?: number;
  lng?: number;
  monitorId?: string;
  url?: string;
  rackPosition?: number;
  rackHeight?: number;
}
