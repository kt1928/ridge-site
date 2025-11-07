# 3D Rack Visualization Setup Guide

## Overview

I've built the foundation for a **3D interactive rack visualization** that displays your homelab equipment. The basic framework is complete and working with placeholder data. Now you need to provide your actual equipment details to make it awesome!

## What's Already Built ✅

- **Interactive 3D rack frame** (parametric, configurable)
- **Orbit controls** (rotate, zoom, pan)
- **Device components** with status LEDs (online/offline/unknown)
- **Click interaction** - click devices to see detailed info panel
- **Auto-integration** with your existing device API
- **Nord-themed styling** matching your site
- **Lighting and shadows** for realistic rendering
- **U-position markers** on the rack
- **Status-based coloring** (pulls from Uptime Kuma)

## What You Need to Provide 📝

### 1. **Your Rack Specifications**

Edit: `components/rack-frame.tsx` (line 78)

Current default values:
```tsx
<RackFrame
  rackUnits={42}  // ← YOUR RACK HEIGHT (42U, 24U, 12U, etc.)
  width={19}      // ← WIDTH IN INCHES (standard is 19")
  depth={30}      // ← DEPTH IN INCHES (24", 30", 36", etc.)
/>
```

**What I need:**
- [ ] How many U is your rack? (common: 42U, 24U, 12U, 6U)
- [ ] Width in inches (almost always 19" for standard racks)
- [ ] Depth in inches (24", 30", 36", or custom)
- [ ] Is it an enclosed rack or open frame? (for future visual enhancement)

---

### 2. **Your Equipment List with Rack Positions**

You need to add `rackPosition` and `rackHeight` to your devices in `data/devices.json`.

**Current device format:**
```json
{
  "id": "device-1",
  "name": "Main Server",
  "type": "Server",
  "os": "Ubuntu 22.04",
  "lat": 40.7128,
  "lng": -74.0060,
  "status": "online",
  "monitorId": "monitor-123",
  "url": "https://server.example.com"
}
```

**Add these fields:**
```json
{
  "id": "device-1",
  "name": "Main Server",
  "type": "Server",
  "os": "Ubuntu 22.04",
  "lat": 40.7128,
  "lng": -74.0060,
  "status": "online",
  "monitorId": "monitor-123",
  "url": "https://server.example.com",
  "rackPosition": 2,    // ← U position from BOTTOM (1, 2, 3... up to your rack size)
  "rackHeight": 2       // ← Height in U (most servers are 1U or 2U, NAS might be 4U)
}
```

**Equipment Inventory Template:**

Copy this table, fill it out, and I'll help you convert it to the proper format:

| Device Name | Type | Rack Position (U from bottom) | Height (U) | Notes |
|-------------|------|-------------------------------|------------|-------|
| Example: Dell R720 | Server | 2 | 2U | Main VM host |
| Example: Netgear Switch | Network | 5 | 1U | 24-port gigabit |
| Example: Synology NAS | Storage | 8 | 4U | 24TB total |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

**How to measure rack position:**
- **1U** = bottom-most position (closest to floor)
- Count UP from there
- Example: If you have a 2U server starting at the bottom, it occupies positions 1-2
- The next device above it would start at position 3

---

### 3. **Device Type Classification**

The 3D models are colored based on device type. Make sure your `type` field uses one of these categories:

**Server** → Dark gray, typical for compute
- "Server", "VM Host", "Compute", "Hypervisor"

**Network** → Medium gray, for switches/routers
- "Network Switch", "Router", "Firewall", "Network"

**Storage** → Light gray, for NAS/SAN
- "Storage", "NAS", "SAN", "Disk Array"

**Other** → Default gray

---

### 4. **Optional: Equipment Photos for Textures** (Phase 2)

If you want REALISTIC front panels instead of simple colored boxes:

**What to do:**
1. Take straight-on photos of your equipment front panels
2. Crop to just the front face (no angles)
3. Name them: `device-1-front.jpg`, `device-2-front.jpg`, etc.
4. Place in: `public/textures/equipment/`

**Photo requirements:**
- Straight-on angle (not at an angle)
- Good lighting
- Minimum 1024px wide
- JPG or PNG format
- Focus on the front panel only

I'll then map these textures onto the 3D models for photorealistic results.

---

### 5. **Optional: 3D Models for Key Equipment** (Phase 3)

For your MOST IMPORTANT gear (like main server, custom builds), we can use realistic 3D models.

**Options:**

**A) Find existing models:**
- Search on Sketchfab: https://sketchfab.com/search?q=server+rack&type=models
- Look for `.glb` or `.gltf` format
- Free models are available for common equipment (Dell servers, HP, etc.)
- Download and place in: `public/models/`

**B) I can help find models:**
Give me your exact equipment model numbers:
- Example: "Dell PowerEdge R720"
- Example: "Synology DS920+"
- Example: "Ubiquiti UniFi Switch 24"

I'll search for downloadable 3D models.

**C) You model them in Blender** (if you know how):
- Create to real dimensions
- Export as `.glb`
- Place in `public/models/`

---

## Quick Start Checklist

**To get your rack visualization working NOW:**

1. [ ] Fill out the equipment inventory table above
2. [ ] Tell me your rack size (probably 42U?)
3. [ ] Confirm your rack depth (24", 30", or 36"?)
4. [ ] Update `data/devices.json` with `rackPosition` and `rackHeight` fields

**That's it!** The rack will immediately display your actual equipment in the correct positions.

---

## Future Enhancements We Can Add

Once basic setup is complete, we can add:

- [ ] **Cable visualization** - show network/power cables between devices
- [ ] **Thermal overlay** - color-code devices by temperature (if you have metrics)
- [ ] **Power draw visualization** - show which devices consume most power
- [ ] **Animations** - rack ears extending, LEDs blinking, fan indicators
- [ ] **Side/rear views** - toggle to see cable management
- [ ] **VR mode** - view in VR using WebXR
- [ ] **Comparison slider** - before/after rack organization
- [ ] **Load realistic 3D models** for specific equipment
- [ ] **Texture mapping** with photos of your actual gear
- [ ] **Interactive PDU** - show which devices are on which power outlets
- [ ] **Airflow visualization** - arrows showing cooling direction

---

## File Locations Reference

**Where everything is:**

```
ridge-site/
├── app/rack/page.tsx              # Main rack page
├── components/
│   ├── rack-scene.tsx             # 3D scene setup, lighting, controls
│   ├── rack-frame.tsx             # Parametric rack frame (EDIT HERE for size)
│   ├── rack-equipment.tsx         # Device rendering and status LEDs
│   └── rack-device-panel.tsx      # Info panel when clicking devices
├── types/device.ts                # Device type with rack fields
├── data/devices.json              # ADD rackPosition & rackHeight here
└── public/
    ├── textures/equipment/        # (CREATE) Put equipment photos here
    └── models/                    # (CREATE) Put 3D models (.glb) here
```

---

## Testing Your Changes

1. Update `data/devices.json` with rack positions
2. Run the dev server: `npm run dev`
3. Visit: `http://localhost:3000/rack`
4. You should see your equipment positioned correctly
5. Click devices to see info panels
6. Use mouse to orbit, zoom, and explore

---

## Need Help?

**Common Issues:**

**Q: Devices are overlapping**
- Make sure `rackPosition` values don't overlap
- Check that `rackHeight` is correct (most servers are 1U or 2U)

**Q: Device is too high or too low**
- Remember: position 1 is BOTTOM, count UP
- Check your rack total height (rackUnits in rack-frame.tsx)

**Q: Status LEDs not working**
- Ensure devices have `monitorId` and Uptime Kuma is configured
- Status pulls from existing API

**Q: Want to change colors**
- Edit Nord colors in `rack-equipment.tsx` (lines 14-22)
- Device colors based on type (lines 67-73)

---

## Where to Place This File

**Recommended location:** `/docs/RACK_SETUP.md`

Or keep it at root: `/RACK_SETUP.md`

---

## Example Data

Here's a complete example of what one device should look like in `data/devices.json`:

```json
{
  "id": "server-main-001",
  "name": "Main Proxmox Host",
  "type": "Server",
  "os": "Proxmox VE 8.0",
  "lat": 40.7128,
  "lng": -74.0060,
  "status": "online",
  "monitorId": "proxmox-monitor",
  "url": "https://proxmox.local:8006",
  "rackPosition": 2,
  "rackHeight": 2
}
```

---

## Ready to Continue?

Once you provide:
1. Equipment inventory (table above)
2. Rack specifications
3. (Optional) Photos or model preferences

I can help you:
- Update the JSON file with correct positions
- Adjust rack dimensions
- Add textures or 3D models
- Fine-tune colors and styling
- Add any of the future enhancements

**Let me know when you're ready with the info!** 🚀
