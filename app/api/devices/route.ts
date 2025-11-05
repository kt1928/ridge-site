import { NextRequest, NextResponse } from 'next/server';
import { readDevices, createDevice } from '@/lib/devices-storage';
import { isAdmin, unauthorizedResponse } from '@/lib/auth';
import { z } from 'zod';

// Validation schema
const createDeviceSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  os: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  monitorId: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
});

export async function GET() {
  try {
    const devices = await readDevices();
    return NextResponse.json(devices);
  } catch (error) {
    console.error('Error reading devices:', error);
    return NextResponse.json(
      { error: 'Failed to read devices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Check admin auth
  if (!isAdmin(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();

    // Validate input
    const validatedData = createDeviceSchema.parse(body);

    // Create device
    const newDevice = await createDevice(validatedData);

    return NextResponse.json(newDevice, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Error creating device:', error);
    return NextResponse.json(
      { error: 'Failed to create device' },
      { status: 500 }
    );
  }
}
