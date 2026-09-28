# Iridium SBD (Short Burst Data) Satellite Adapter & Authoritative Government API Integrations
**IPE-LAMS | Ministry of Earth Sciences (MoES) & NCPOR Goa**

---

## 1. Iridium SBD Satellite Transceiver Integration

### Hardware Compatibility
- **Iridium 9602 / 9603N SBD Transceivers**
- **Iridium Edge / Edge Pro Telemetry Gateways**
- **RockBLOCK 9603 Satellite Communication Module**
- **Antenna**: High-gain passive patch or helical antenna rated for extreme polar temperatures down to -55°C.

### Telemetry Binary Frame Format (16-Byte Compact Packet)
Because satellite airtime cost is charged per byte, polar telemetry packets are binary-packed:

| Byte Offset | Field Name | Data Type | Encoding / Scale Factor | Description |
|---|---|---|---|---|
| `0x00 - 0x01` | Header Magic | uint16 | `0x5342` ("SB") | Packet synchronization marker |
| `0x02 - 0x05` | Latitude | int32 | Scale: `value / 10000.0` | Signed latitude in micro-degrees (e.g. -707660 -> -70.7660° S) |
| `0x06 - 0x09` | Longitude | int32 | Scale: `value / 10000.0` | Signed longitude in micro-degrees (e.g. 117350 -> +11.7350° E) |
| `0x0A - 0x0B` | Temperature | int16 | Scale: `value / 10.0` | Signed temperature in °C (e.g. -285 -> -28.5°C) |
| `0x0C` | Battery Level | uint8 | Value `0 - 100` | Remaining battery percentage |
| `0x0D` | Shock G-Force | uint8 | Scale: `value / 10.0` | Peak shock sensor reading (e.g. 15 -> 1.5 G) |
| `0x0E` | Fuel / Power | uint8 | Value `0 - 100` | Remaining diesel/battery reserve percentage |
| `0x0F` | Status Flags | uint8 | Bitmask | Bit 0: Nominal, Bit 1: Warning, Bit 7: SOS Distress |

### Live Hex Ingestion Sample
To test the live Iridium SBD decoder on the running system, POST to `/api/telemetry/ingest`:
```bash
curl -X POST http://localhost:3000/api/telemetry/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "assetId": "AST-PB-01",
    "source": "IRIDIUM_SBD",
    "rawPacketHex": "5342ff53f9380001caa6fe7f540f3e01"
  }'
```

---

## 2. Authoritative Government APIs Adapter Guide

IPE-LAMS is pre-configured with adapter hooks to consume real feeds from Indian and international polar observation programs:

### 1. MOSDAC (Meteorological and Oceanographic Satellite Data Archival Centre - SAC / ISRO)
- **Portal**: https://www.mosdac.gov.in
- **Products**: Polar Sea Ice Extent, OceanSat-3 Scatterometer Wind Vectors, INSAT-3D/3DR Polar Imagery.
- **Adapter Configuration**:
  ```env
  MOSDAC_API_KEY="your_mosdac_token"
  MOSDAC_POLAR_BASE="https://mosdac.gov.in/api/v2/polar"
  ```

### 2. IMD Polar Weather Network (India Meteorological Department)
- **Stations**: Maitri (WMO ID 89514), Bharati (WMO ID 89512), Himadri (Ny-Ålesund, WMO ID 01004).
- **Endpoint**: Real-time AWS (Automatic Weather Station) broadcast data feeds.
- **In-App Live Integration**: In development and offline testing, the system pulls live surface weather from Open-Meteo's WMO-standard global model using exact MoES station GPS coordinates.

### 3. Copernicus Marine Service & ECMWF
- **Product**: `SEAICE_GLO_SEAICE_L4_NRT_OBSERVATIONS_011_001` (Daily Sea Ice Concentration, Thickness, and Drift for Antarctic Southern Ocean and Arctic Kongsfjorden).
- **Credentials**: Register at https://marine.copernicus.eu and provide API keys in the system adapter settings.
