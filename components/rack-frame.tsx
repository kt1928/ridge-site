'use client';

import { useMemo } from 'react';
import { Text } from '@react-three/drei';

interface RackFrameProps {
  rackUnits: number; // Standard rack heights: 42U, 24U, 12U, etc.
  width?: number; // Inches, default 19" (standard)
  depth?: number; // Inches, default 30"
}

// Convert inches to Three.js units (1 inch = 0.0254 meters, scaled for visibility)
const INCH_TO_UNIT = 0.05;
const RACK_UNIT_HEIGHT = 1.75 * INCH_TO_UNIT; // 1U = 1.75 inches

// Nord colors
const NORD_COLORS = {
  nord0: "#2E3440",
  nord1: "#3B4252",
  nord2: "#434C5E",
  nord3: "#4C566A",
  nord8: "#88C0D0",
  nord6: "#ECEFF4",
};

export function RackFrame({ rackUnits = 42, width = 19, depth = 30 }: RackFrameProps) {
  const frameHeight = rackUnits * RACK_UNIT_HEIGHT;
  const frameWidth = width * INCH_TO_UNIT;
  const frameDepth = depth * INCH_TO_UNIT;

  // Generate U markers (every 2U for readability)
  const uMarkers = useMemo(() => {
    const markers = [];
    for (let u = 0; u <= rackUnits; u += 2) {
      if (u === 0) continue; // Skip 0
      const yPos = u * RACK_UNIT_HEIGHT;
      markers.push({ u, yPos });
    }
    return markers;
  }, [rackUnits]);

  return (
    <group position={[0, frameHeight / 2, 0]}>
      {/* Vertical Posts (4 corners) */}
      {/* Front Left */}
      <mesh position={[-frameWidth / 2, 0, frameDepth / 2]} castShadow>
        <boxGeometry args={[0.04, frameHeight, 0.04]} />
        <meshStandardMaterial color={NORD_COLORS.nord3} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Front Right */}
      <mesh position={[frameWidth / 2, 0, frameDepth / 2]} castShadow>
        <boxGeometry args={[0.04, frameHeight, 0.04]} />
        <meshStandardMaterial color={NORD_COLORS.nord3} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Back Left */}
      <mesh position={[-frameWidth / 2, 0, -frameDepth / 2]} castShadow>
        <boxGeometry args={[0.04, frameHeight, 0.04]} />
        <meshStandardMaterial color={NORD_COLORS.nord3} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Back Right */}
      <mesh position={[frameWidth / 2, 0, -frameDepth / 2]} castShadow>
        <boxGeometry args={[0.04, frameHeight, 0.04]} />
        <meshStandardMaterial color={NORD_COLORS.nord3} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Horizontal Rails - Front (mounting rails) */}
      {uMarkers.map(({ u, yPos }) => (
        <group key={`rail-front-${u}`}>
          {/* Left rail */}
          <mesh position={[-frameWidth / 2 + 0.06, yPos - frameHeight / 2, frameDepth / 2]}>
            <boxGeometry args={[0.02, 0.01, 0.03]} />
            <meshStandardMaterial color={NORD_COLORS.nord2} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Right rail */}
          <mesh position={[frameWidth / 2 - 0.06, yPos - frameHeight / 2, frameDepth / 2]}>
            <boxGeometry args={[0.02, 0.01, 0.03]} />
            <meshStandardMaterial color={NORD_COLORS.nord2} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* U Markers */}
      {uMarkers.map(({ u, yPos }) => (
        <Text
          key={`marker-${u}`}
          position={[frameWidth / 2 + 0.15, yPos - frameHeight / 2, frameDepth / 2]}
          fontSize={0.04}
          color={NORD_COLORS.nord8}
          anchorX="left"
          anchorY="middle"
        >
          {u}U
        </Text>
      ))}

      {/* Base platform */}
      <mesh position={[0, -frameHeight / 2 - 0.02, 0]} receiveShadow>
        <boxGeometry args={[frameWidth + 0.1, 0.04, frameDepth + 0.1]} />
        <meshStandardMaterial color={NORD_COLORS.nord1} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Top platform */}
      <mesh position={[0, frameHeight / 2 + 0.02, 0]} receiveShadow>
        <boxGeometry args={[frameWidth + 0.1, 0.04, frameDepth + 0.1]} />
        <meshStandardMaterial color={NORD_COLORS.nord1} metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}
