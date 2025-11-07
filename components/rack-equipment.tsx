'use client';

import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { Device } from '@/types/device';
import type { Mesh } from 'three';

interface RackEquipmentProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
}

const INCH_TO_UNIT = 0.05;
const RACK_UNIT_HEIGHT = 1.75 * INCH_TO_UNIT;

// Nord colors
const NORD_COLORS = {
  nord0: "#2E3440",
  nord1: "#3B4252",
  nord2: "#434C5E",
  nord3: "#4C566A",
  nord8: "#88C0D0",
  nord11: "#BF616A",
  nord13: "#EBCB8B",
  nord14: "#A3BE8C",
};

interface EquipmentDeviceProps {
  device: Device;
  rackPosition: number; // U position from bottom (1-42)
  rackHeight: number; // Height in U (1U, 2U, etc.)
  onClick: () => void;
}

function EquipmentDevice({ device, rackPosition, rackHeight, onClick }: EquipmentDeviceProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Pulse animation for hovered state
  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.02);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  // Calculate position based on rack units
  // Position 0 is center of rack, we need to offset based on total height
  const totalRackHeight = 42 * RACK_UNIT_HEIGHT;
  const deviceHeight = rackHeight * RACK_UNIT_HEIGHT;
  const yPosition = (rackPosition * RACK_UNIT_HEIGHT) - (totalRackHeight / 2) + (deviceHeight / 2);

  // Device dimensions
  const width = 19 * INCH_TO_UNIT - 0.1; // Slightly smaller than rack width
  const depth = 28 * INCH_TO_UNIT; // Standard server depth

  // Color based on device type
  const getDeviceColor = () => {
    const type = device.type.toLowerCase();
    if (type.includes('server')) return NORD_COLORS.nord2;
    if (type.includes('switch') || type.includes('network')) return NORD_COLORS.nord3;
    if (type.includes('storage') || type.includes('nas')) return NORD_COLORS.nord1;
    return NORD_COLORS.nord2;
  };

  // Status LED color
  const getStatusColor = () => {
    switch (device.status) {
      case 'online': return NORD_COLORS.nord14;
      case 'offline': return NORD_COLORS.nord11;
      default: return NORD_COLORS.nord13;
    }
  };

  return (
    <group position={[0, yPosition, 0]}>
      {/* Main device body */}
      <mesh
        ref={meshRef}
        castShadow
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[width, deviceHeight - 0.005, depth]} />
        <meshStandardMaterial
          color={getDeviceColor()}
          metalness={0.6}
          roughness={0.4}
          emissive={hovered ? NORD_COLORS.nord8 : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Front panel detail */}
      <mesh position={[0, 0, depth / 2 + 0.002]} castShadow>
        <boxGeometry args={[width - 0.05, deviceHeight - 0.01, 0.004]} />
        <meshStandardMaterial
          color={NORD_COLORS.nord0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Status LEDs (3 small lights) */}
      {[0, 1, 2].map((i) => (
        <StatusLED
          key={i}
          position={[-width / 2 + 0.1 + i * 0.05, 0, depth / 2 + 0.006]}
          color={i === 0 ? getStatusColor() : NORD_COLORS.nord3}
          isActive={i === 0}
        />
      ))}

      {/* Device label */}
      <Text
        position={[0, 0, depth / 2 + 0.008]}
        fontSize={0.025}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={width - 0.3}
        overflowWrap="break-word"
      >
        {device.name}
      </Text>

      {/* Hover label above device */}
      {hovered && (
        <Text
          position={[0, deviceHeight / 2 + 0.1, depth / 2]}
          fontSize={0.035}
          color={NORD_COLORS.nord8}
          anchorX="center"
          anchorY="bottom"
        >
          Click for details
        </Text>
      )}
    </group>
  );
}

interface StatusLEDProps {
  position: [number, number, number];
  color: string;
  isActive?: boolean;
}

function StatusLED({ position, color, isActive = false }: StatusLEDProps) {
  const ledRef = useRef<Mesh>(null);

  // Pulse active LEDs
  useFrame((state) => {
    if (ledRef.current && isActive) {
      const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
      (ledRef.current.material as any).emissiveIntensity = intensity;
    }
  });

  return (
    <mesh ref={ledRef} position={position}>
      <sphereGeometry args={[0.008, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isActive ? 1 : 0.3}
        metalness={0.5}
        roughness={0.2}
      />
      {/* LED glow effect */}
      {isActive && (
        <pointLight
          color={color}
          intensity={0.3}
          distance={0.2}
          position={[0, 0, 0.01]}
        />
      )}
    </mesh>
  );
}

export function RackEquipment({ devices, onDeviceClick }: RackEquipmentProps) {
  // THIS IS WHERE YOU'LL PROVIDE YOUR EQUIPMENT DATA
  // For now, we'll create placeholder positions
  // You'll replace this with your actual device list including rack positions

  // Filter devices that have rack position data
  // In the future, devices will have rackPosition and rackHeight properties
  const rackDevices = devices.filter((d: any) => d.rackPosition !== undefined);

  // Placeholder devices if no rack data exists yet
  const placeholderDevices = rackDevices.length === 0 ? [
    { device: devices[0] || { id: '1', name: 'Main Server', type: 'Server', status: 'online' as const }, rackPosition: 2, rackHeight: 2 },
    { device: devices[1] || { id: '2', name: 'Network Switch', type: 'Network', status: 'online' as const }, rackPosition: 5, rackHeight: 1 },
    { device: devices[2] || { id: '3', name: 'NAS Storage', type: 'Storage', status: 'online' as const }, rackPosition: 8, rackHeight: 4 },
  ] : [];

  const displayDevices = rackDevices.length > 0
    ? rackDevices.map((d: any) => ({ device: d, rackPosition: d.rackPosition, rackHeight: d.rackHeight || 1 }))
    : placeholderDevices;

  return (
    <>
      {displayDevices.map(({ device, rackPosition, rackHeight }: any) => (
        <EquipmentDevice
          key={device.id}
          device={device}
          rackPosition={rackPosition}
          rackHeight={rackHeight}
          onClick={() => onDeviceClick(device)}
        />
      ))}
    </>
  );
}
