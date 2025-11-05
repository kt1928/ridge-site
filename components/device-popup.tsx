import type { Device } from '@/types/device';

interface DevicePopupProps {
  device: Device;
}

export function DevicePopup({ device }: DevicePopupProps) {
  const statusClass =
    device.status === 'online'
      ? 'status-online'
      : device.status === 'offline'
        ? 'status-offline'
        : 'status-unknown';

  return (
    <div className="nord-popup">
      <span className={`status-dot ${statusClass}`} aria-label={`Status: ${device.status}`} />
      <div className="title">{device.name}</div>
      <div className="row">
        <span className="label">Type:</span>
        <span className="val">{device.type}</span>
      </div>
      <div className="row">
        <span className="label">OS:</span>
        <span className="val">{device.os}</span>
      </div>
      <div className="row">
        <span className="label">Lat/Lng:</span>
        <span className="val">
          {device.lat.toFixed(5)}, {device.lng.toFixed(5)}
        </span>
      </div>
      {device.url && (
        <a
          className="link"
          href={device.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Manage →
        </a>
      )}
    </div>
  );
}
