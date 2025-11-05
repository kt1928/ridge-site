import { NextRequest, NextResponse } from 'next/server';
import { getDeviceById, updateDevice, deleteDevice } from '@/lib/devices-storage';
import { isAdmin, unauthorizedResponse } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for updates
const updateDeviceSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  os: z.string().min(1).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  monitorId: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
}).strict();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const device = await getDeviceById(id);

    if (!device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(device);
  } catch (error) {
    console.error('Error reading device:', error);
    return NextResponse.json(
      { error: 'Failed to read device' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin auth
  if (!isAdmin(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateDeviceSchema.parse(body);

    // Update device
    const updatedDevice = await updateDevice(id, validatedData);

    return NextResponse.json(updatedDevice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Error updating device:', error);
    return NextResponse.json(
      { error: 'Failed to update device' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin auth
  if (!isAdmin(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    await deleteDevice(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    console.error('Error deleting device:', error);
    return NextResponse.json(
      { error: 'Failed to delete device' },
      { status: 500 }
    );
  }
}
