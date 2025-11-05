import { promises as fs } from 'fs';
import path from 'path';
import type { Device, DeviceCreateInput, DeviceUpdateInput } from '@/types/device';

const DEVICES_FILE = path.join(process.cwd(), 'data', 'devices.json');

// Simple in-memory lock to prevent concurrent writes
let isWriting = false;
const writeLock = async () => {
  while (isWriting) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  isWriting = true;
};

const writeUnlock = () => {
  isWriting = false;
};

export async function readDevices(): Promise<Device[]> {
  try {
    const data = await fs.readFile(DEVICES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function writeDevices(devices: Device[]): Promise<void> {
  await writeLock();
  try {
    await fs.writeFile(DEVICES_FILE, JSON.stringify(devices, null, 2), 'utf-8');
  } finally {
    writeUnlock();
  }
}

export async function getDeviceById(id: string): Promise<Device | undefined> {
  const devices = await readDevices();
  return devices.find(d => d.id === id);
}

export async function createDevice(input: DeviceCreateInput): Promise<Device> {
  const devices = await readDevices();

  // Generate ID from name
  const id = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Check for duplicate ID
  if (devices.some(d => d.id === id)) {
    throw new Error(`Device with ID "${id}" already exists`);
  }

  const newDevice: Device = {
    id,
    ...input,
    status: 'unknown',
  };

  devices.push(newDevice);
  await writeDevices(devices);

  return newDevice;
}

export async function updateDevice(id: string, input: DeviceUpdateInput): Promise<Device> {
  const devices = await readDevices();
  const index = devices.findIndex(d => d.id === id);

  if (index === -1) {
    throw new Error(`Device with ID "${id}" not found`);
  }

  const updatedDevice: Device = {
    ...devices[index],
    ...input,
  };

  devices[index] = updatedDevice;
  await writeDevices(devices);

  return updatedDevice;
}

export async function deleteDevice(id: string): Promise<void> {
  const devices = await readDevices();
  const filteredDevices = devices.filter(d => d.id !== id);

  if (filteredDevices.length === devices.length) {
    throw new Error(`Device with ID "${id}" not found`);
  }

  await writeDevices(filteredDevices);
}
