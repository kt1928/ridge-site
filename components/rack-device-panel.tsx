'use client';

import { X, Server, HardDrive, Network, ExternalLink } from 'lucide-react';
import type { Device } from '@/types/device';

interface RackDevicePanelProps {
  device: Device;
  onClose: () => void;
}

const NORD_COLORS = {
  nord0: "#2E3440",
  nord1: "#3B4252",
  nord2: "#434C5E",
  nord3: "#4C566A",
  nord4: "#D8DEE9",
  nord6: "#ECEFF4",
  nord8: "#88C0D0",
  nord11: "#BF616A",
  nord13: "#EBCB8B",
  nord14: "#A3BE8C",
};

export function RackDevicePanel({ device, onClose }: RackDevicePanelProps) {
  const getStatusColor = () => {
    switch (device.status) {
      case 'online': return NORD_COLORS.nord14;
      case 'offline': return NORD_COLORS.nord11;
      default: return NORD_COLORS.nord13;
    }
  };

  const getDeviceIcon = () => {
    const type = device.type.toLowerCase();
    if (type.includes('server')) return Server;
    if (type.includes('storage') || type.includes('nas')) return HardDrive;
    if (type.includes('network') || type.includes('switch')) return Network;
    return Server;
  };

  const Icon = getDeviceIcon();

  return (
    <div
      className="absolute top-24 right-8 z-30 w-96 rounded-lg shadow-2xl"
      style={{
        background: NORD_COLORS.nord1,
        border: `2px solid ${NORD_COLORS.nord3}`,
      }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-start p-4 border-b"
        style={{ borderColor: NORD_COLORS.nord3 }}
      >
        <div className="flex items-start gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ background: NORD_COLORS.nord2 }}
          >
            <Icon size={24} style={{ color: NORD_COLORS.nord8 }} />
          </div>
          <div>
            <h3 className="text-xl font-bold" style={{ color: NORD_COLORS.nord6 }}>
              {device.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: getStatusColor() }}
              />
              <span className="text-sm capitalize" style={{ color: NORD_COLORS.nord4 }}>
                {device.status}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-nord-2 transition-colors"
          style={{ color: NORD_COLORS.nord4 }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Basic Info */}
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: NORD_COLORS.nord8 }}>
            DEVICE INFORMATION
          </div>
          <div className="space-y-2">
            <InfoRow label="Type" value={device.type} />
            <InfoRow label="Operating System" value={device.os} />
            {(device as any).rackPosition && (
              <InfoRow
                label="Rack Position"
                value={`${(device as any).rackPosition}U (${(device as any).rackHeight || 1}U height)`}
              />
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: NORD_COLORS.nord8 }}>
            LOCATION
          </div>
          <div className="space-y-2">
            <InfoRow label="Latitude" value={device.lat.toFixed(6)} />
            <InfoRow label="Longitude" value={device.lng.toFixed(6)} />
          </div>
        </div>

        {/* Monitoring */}
        {device.monitorId && (
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: NORD_COLORS.nord8 }}>
              MONITORING
            </div>
            <InfoRow label="Monitor ID" value={device.monitorId} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {device.url && (
            <a
              href={device.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-all hover:scale-105 flex-1 justify-center"
              style={{
                background: NORD_COLORS.nord8,
                color: NORD_COLORS.nord0,
              }}
            >
              <ExternalLink size={16} />
              <span className="text-sm font-medium">Manage</span>
            </a>
          )}
          <a
            href={`/map?device=${device.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-md transition-all hover:scale-105 flex-1 justify-center"
            style={{
              background: NORD_COLORS.nord2,
              color: NORD_COLORS.nord6,
              border: `1px solid ${NORD_COLORS.nord3}`,
            }}
          >
            <span className="text-sm font-medium">View on Map</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm" style={{ color: NORD_COLORS.nord4 }}>
        {label}:
      </span>
      <span className="text-sm font-mono" style={{ color: NORD_COLORS.nord6 }}>
        {value}
      </span>
    </div>
  );
}
