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
}

export interface DeviceUpdateInput {
  name?: string;
  type?: string;
  os?: string;
  lat?: number;
  lng?: number;
  monitorId?: string;
  url?: string;
}
