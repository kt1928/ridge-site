'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import type { Device, DeviceCreateInput } from '@/types/device';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Get admin credentials from environment or use defaults
const getAuthHeader = () => {
  const username = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin';
  const credentials = btoa(`${username}:${password}`);
  return `Basic ${credentials}`;
};

export default function AdminMapPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<DeviceCreateInput>({
    name: '',
    type: '',
    os: '',
    lat: 40.7128,
    lng: -74.0060,
    monitorId: '',
    url: '',
  });

  const { data: devices, error } = useSWR<Device[]>('/api/devices', fetcher, {
    refreshInterval: 5000,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      os: '',
      lat: 40.7128,
      lng: -74.0060,
      monitorId: '',
      url: '',
    });
    setEditingDevice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingDevice
        ? `/api/devices/${editingDevice.id}`
        : '/api/devices';

      const method = editingDevice ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save device');
      }

      toast({
        title: editingDevice ? 'Device updated' : 'Device created',
        description: `${formData.name} has been ${editingDevice ? 'updated' : 'added'} successfully.`,
      });

      setIsDialogOpen(false);
      resetForm();
      mutate('/api/devices');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save device',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      type: device.type,
      os: device.os,
      lat: device.lat,
      lng: device.lng,
      monitorId: device.monitorId || '',
      url: device.url || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (device: Device) => {
    if (!confirm(`Are you sure you want to delete ${device.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/devices/${device.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete device');
      }

      toast({
        title: 'Device deleted',
        description: `${device.name} has been removed.`,
      });

      mutate('/api/devices');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete device',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-nord-0 text-nord-6 p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Device Management</h1>
            <p className="text-nord-4">Manage your NYC homelab devices</p>
          </div>
          <div className="flex gap-3">
            <Link href="/map">
              <Button variant="outline" className="bg-nord-1 border-nord-3 text-nord-6 hover:bg-nord-2">
                <Eye className="mr-2 h-4 w-4" />
                View Map
              </Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-nord-8 hover:bg-nord-7 text-nord-0">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-nord-1 border-nord-3 text-nord-6">
                <DialogHeader>
                  <DialogTitle className="text-nord-6">
                    {editingDevice ? 'Edit Device' : 'Add New Device'}
                  </DialogTitle>
                  <DialogDescription className="text-nord-4">
                    {editingDevice
                      ? 'Update device information'
                      : 'Add a new device to the map'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-nord-5">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-nord-2 border-nord-3 text-nord-6"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type" className="text-nord-5">Type</Label>
                      <Input
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        required
                        placeholder="e.g., Proxmox Node, Web Server"
                        className="bg-nord-2 border-nord-3 text-nord-6"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="os" className="text-nord-5">Operating System</Label>
                      <Input
                        id="os"
                        value={formData.os}
                        onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                        required
                        placeholder="e.g., Proxmox VE 8.2"
                        className="bg-nord-2 border-nord-3 text-nord-6"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="lat" className="text-nord-5">Latitude</Label>
                        <Input
                          id="lat"
                          type="number"
                          step="0.00001"
                          value={formData.lat}
                          onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                          required
                          className="bg-nord-2 border-nord-3 text-nord-6"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lng" className="text-nord-5">Longitude</Label>
                        <Input
                          id="lng"
                          type="number"
                          step="0.00001"
                          value={formData.lng}
                          onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                          required
                          className="bg-nord-2 border-nord-3 text-nord-6"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="monitorId" className="text-nord-5">
                        Uptime Kuma Monitor ID <span className="text-nord-4">(optional)</span>
                      </Label>
                      <Input
                        id="monitorId"
                        value={formData.monitorId}
                        onChange={(e) => setFormData({ ...formData, monitorId: e.target.value })}
                        placeholder="kuma-123"
                        className="bg-nord-2 border-nord-3 text-nord-6"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="url" className="text-nord-5">
                        Management URL <span className="text-nord-4">(optional)</span>
                      </Label>
                      <Input
                        id="url"
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://device.example.local"
                        className="bg-nord-2 border-nord-3 text-nord-6"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                      className="bg-nord-2 border-nord-3 text-nord-6 hover:bg-nord-3"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-nord-8 hover:bg-nord-7 text-nord-0">
                      {editingDevice ? 'Update' : 'Create'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && (
          <div className="bg-nord-11 text-nord-6 p-4 rounded mb-4">
            Error loading devices: {error.message}
          </div>
        )}

        {!devices && !error && (
          <div className="text-center text-nord-4 py-8">Loading devices...</div>
        )}

        {devices && (
          <div className="bg-nord-1 rounded-lg border border-nord-3 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-nord-3 hover:bg-nord-2">
                  <TableHead className="text-nord-4">Name</TableHead>
                  <TableHead className="text-nord-4">Type</TableHead>
                  <TableHead className="text-nord-4">OS</TableHead>
                  <TableHead className="text-nord-4">Location</TableHead>
                  <TableHead className="text-nord-4">Monitor ID</TableHead>
                  <TableHead className="text-nord-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-nord-4 py-8">
                      No devices yet. Add your first device to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  devices.map((device) => (
                    <TableRow key={device.id} className="border-nord-3 hover:bg-nord-2">
                      <TableCell className="font-medium text-nord-6">{device.name}</TableCell>
                      <TableCell className="text-nord-5">{device.type}</TableCell>
                      <TableCell className="text-nord-5">{device.os}</TableCell>
                      <TableCell className="text-nord-5 font-mono text-xs">
                        {device.lat.toFixed(5)}, {device.lng.toFixed(5)}
                      </TableCell>
                      <TableCell className="text-nord-5 font-mono text-xs">
                        {device.monitorId || '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(device)}
                            className="text-nord-8 hover:text-nord-7 hover:bg-nord-2"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(device)}
                            className="text-nord-11 hover:text-nord-11 hover:bg-nord-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-8 p-4 bg-nord-1 border border-nord-3 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-nord-6">Authentication Note</h2>
          <p className="text-nord-4 text-sm">
            This admin interface uses Basic Auth for demonstration. Default credentials are{' '}
            <code className="bg-nord-2 px-2 py-1 rounded text-nord-8">admin/admin</code>.
            In production, integrate with Authelia, Authentik, or another SSO provider.
            Set <code className="bg-nord-2 px-2 py-1 rounded text-nord-8">ADMIN_USERNAME</code> and{' '}
            <code className="bg-nord-2 px-2 py-1 rounded text-nord-8">ADMIN_PASSWORD</code> environment
            variables to change credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
