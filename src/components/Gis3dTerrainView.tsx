import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  GisFeatureLayer,
  SafeShelterSite,
  EvacuationRoutePath,
  DemTerrainPoint,
  UserRole,
  AppTheme,
} from "../types";
import {
  MOCK_SAFE_SHELTERS,
  MOCK_EVACUATION_ROUTES,
} from "../data/enhancedDisasterData";
import {
  Layers,
  RotateCw,
  Eye,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  CloudRain,
  Waves,
  Navigation,
  Home,
  Flame,
  Maximize2,
  Info,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Mountain,
  Globe,
  Ship,
  MapPin,
  ArrowRight,
  Anchor,
  Radio,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface Gis3dTerrainViewProps {
  userRole?: UserRole;
  theme?: AppTheme;
  onSelectShelter?: (shelter: SafeShelterSite) => void;
  onSelectRoute?: (route: EvacuationRoutePath) => void;
}

// Global Polar Expedition Stations & Waypoints
interface WorldExpeditionPoint {
  id: string;
  name: string;
  subName: string;
  lat: number;
  lon: number;
  type: "ORIGIN" | "GATEWAY" | "VESSEL" | "STATION_ANTARCTIC" | "STATION_ARCTIC";
  color: string;
  details: string;
}

const WORLD_EXPEDITION_POINTS: WorldExpeditionPoint[] = [
  {
    id: "PT-INDIA",
    name: "NCPOR HQ (Goa, India)",
    subName: "Expedition Departure Origin",
    lat: 15.4,
    lon: 73.8,
    type: "ORIGIN",
    color: "#f59e0b",
    details: "44th Indian Antarctic Expedition Command & Departure Port",
  },
  {
    id: "PT-CAPETOWN",
    name: "Cape Town Gateway",
    subName: "Southern Logistics Staging",
    lat: -33.9,
    lon: 18.4,
    type: "GATEWAY",
    color: "#38bdf8",
    details: "Air/Sea Intermodal Gateway to Queen Maud Land",
  },
  {
    id: "PT-VESSEL",
    name: "MV Vasiliy Golovnin",
    subName: "Active Polar Icebreaker Fleet",
    lat: -58.5,
    lon: 48.2,
    type: "VESSEL",
    color: "#06b6d4",
    details: "Transit: Roaring Forties • Speed: 12.4 kt • Ice Arc7",
  },
  {
    id: "PT-MAITRI",
    name: "Maitri Base Station",
    subName: "Queen Maud Land, Antarctica",
    lat: -70.76,
    lon: 11.73,
    type: "STATION_ANTARCTIC",
    color: "#10b981",
    details: "Permanent Year-Round Research Base • 44th IAE Winter Team",
  },
  {
    id: "PT-BHARATI",
    name: "Bharati Research Base",
    subName: "Larsemann Hills / Prydz Bay",
    lat: -69.41,
    lon: 76.19,
    type: "STATION_ANTARCTIC",
    color: "#3b82f6",
    details: "Oceanographic & Cryospheric Hub • Fast-Ice Approach",
  },
  {
    id: "PT-HIMADRI",
    name: "Himadri Station",
    subName: "Ny-Ålesund, Svalbard (Arctic)",
    lat: 78.92,
    lon: 11.93,
    type: "STATION_ARCTIC",
    color: "#a855f7",
    details: "Arctic Research Observatory (79° N)",
  },
];

export const Gis3dTerrainView: React.FC<Gis3dTerrainViewProps> = ({
  userRole = "ADMIN",
  theme = "DARK",
  onSelectShelter,
  onSelectRoute,
}) => {
  const isLight = theme === "PASTEL_LIGHT";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // View Mode: Local 3D DEM vs Full World Geographic View
  const [isWorldView, setIsWorldView] = useState<boolean>(false);
  const [transitionProgress, setTransitionProgress] = useState<number>(0);
  const [worldZoom, setWorldZoom] = useState<number>(1.0);
  const [selectedWorldPoint, setSelectedWorldPoint] = useState<WorldExpeditionPoint | null>(
    WORLD_EXPEDITION_POINTS[0]
  );
  const [particleOffset, setParticleOffset] = useState<number>(0);

  // Drag interaction state for both 3D DEM and World Map
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Camera & DEM Controls
  const [rotationAngle, setRotationAngle] = useState<number>(45);
  const [tiltAngle, setTiltAngle] = useState<number>(55);
  const [elevationScale, setElevationScale] = useState<number>(1.5);
  const [renderMode, setRenderMode] = useState<"MESH" | "WIREFRAME" | "HEATMAP">("MESH");
  const [selectedPoint, setSelectedPoint] = useState<DemTerrainPoint | null>(null);

  // Layers Toggles
  const [layers, setLayers] = useState<GisFeatureLayer[]>([
    { id: "layer-rainfall", name: "Rainfall & Blizzard Radar", type: "RAINFALL_RADAR", enabled: true, opacity: 0.8, color: "#38bdf8" },
    { id: "layer-inundation", name: "Flood & Melt Inundation Zones", type: "INUNDATION_ZONE", enabled: true, opacity: 0.75, color: "#0284c7" },
    { id: "layer-routes", name: "Evacuation Corridors & Waypoints", type: "EVACUATION_ROUTE", enabled: true, opacity: 1.0, color: "#34d399" },
    { id: "layer-shelters", name: "Safe Shelters & Hardened Hubs", type: "SHELTER_SAFE_SITE", enabled: true, opacity: 1.0, color: "#f59e0b" },
    { id: "layer-heatmap", name: "Vulnerability Scoring Heatmap", type: "VULNERABILITY_HEATMAP", enabled: false, opacity: 0.6, color: "#f87171" },
  ]);

  // Interactive Simulation Controls
  const [rainfallRateMmH, setRainfallRateMmH] = useState<number>(65); // 0-150 mm/h
  const [simHour, setSimHour] = useState<number>(6); // 0-24 hours
  const [isPlayingSim, setIsPlayingSim] = useState<boolean>(false);
  const [activeShelterDetail, setActiveShelterDetail] = useState<SafeShelterSite | null>(MOCK_SAFE_SHELTERS[0]);
  const [activeRouteDetail, setActiveRouteDetail] = useState<EvacuationRoutePath | null>(MOCK_EVACUATION_ROUTES[0]);

  // Animated pulse along expedition route
  useEffect(() => {
    const anim = setInterval(() => {
      setParticleOffset((prev) => (prev + 0.015) % 1);
    }, 40);
    return () => clearInterval(anim);
  }, []);

  // Smooth camera zoom/fly transition when switching to/from World Map
  const triggerWorldTransition = useCallback(() => {
    if (!isWorldView) {
      setIsWorldView(true);
      setTransitionProgress(0);
      let p = 0;
      const step = () => {
        p += 0.08;
        if (p < 1) {
          setTransitionProgress(p);
          requestAnimationFrame(step);
        } else {
          setTransitionProgress(1);
        }
      };
      requestAnimationFrame(step);
    } else {
      setIsWorldView(false);
      setTransitionProgress(1);
      let p = 1;
      const step = () => {
        p -= 0.08;
        if (p > 0) {
          setTransitionProgress(p);
          requestAnimationFrame(step);
        } else {
          setTransitionProgress(0);
        }
      };
      requestAnimationFrame(step);
    }
  }, [isWorldView]);

  // Simulation play loop
  useEffect(() => {
    let timer: any = null;
    if (isPlayingSim) {
      timer = setInterval(() => {
        setSimHour((prev) => {
          if (prev >= 24) {
            setIsPlayingSim(false);
            return 24;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlayingSim]);

  // Generate Synthetic 3D DEM Grid (28 x 28 points)
  const GRID_SIZE = 28;
  const [demGrid, setDemGrid] = useState<DemTerrainPoint[][]>([]);

  useEffect(() => {
    const grid: DemTerrainPoint[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const row: DemTerrainPoint[] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        const nx = (x - GRID_SIZE / 2) / 8;
        const ny = (y - GRID_SIZE / 2) / 8;
        const distCenter = Math.sqrt(nx * nx + ny * ny);

        const peak1 = Math.exp(-((nx - 1) ** 2 + (ny - 1) ** 2) / 2) * 110;
        const peak2 = Math.exp(-((nx + 1.2) ** 2 + (ny + 0.8) ** 2) / 3) * 140;
        const valley = Math.sin(nx * 1.5) * Math.cos(ny * 1.5) * 25;
        const baseElevation = 40 + peak1 + peak2 + valley + (Math.sin(x * 0.8) + Math.cos(y * 0.8)) * 8;

        const accumulationFactor = Math.max(0, (75 - baseElevation) / 75);
        const waterDepth = (rainfallRateMmH / 100) * (simHour / 8) * 2.8 * accumulationFactor;
        const slope = Math.min(45, Math.abs(Math.sin(nx * 2) * 20 + Math.cos(ny * 2) * 15));
        const vulnScore = Math.min(100, Math.max(10, (waterDepth * 25) + (slope > 25 ? 30 : 10) + (distCenter < 1.5 ? 20 : 5)));

        let hazardZone: DemTerrainPoint["hazardZone"] = "SAFE";
        if (waterDepth > 1.2) hazardZone = "FLOOD_PRONE";
        else if (slope > 30) hazardZone = "EXTREME_AVALANCHE";
        else if (waterDepth > 0.4 || vulnScore > 50) hazardZone = "WATCH";

        row.push({
          x,
          y,
          elevationM: Math.round(baseElevation),
          slopeDeg: Math.round(slope),
          inundationLevelM: Number(waterDepth.toFixed(2)),
          vulnerabilityScore: Math.round(vulnScore),
          hazardZone,
        });
      }
      grid.push(row);
    }
    setDemGrid(grid);
  }, [rainfallRateMmH, simHour]);

  // Main Canvas Rendering Loop (Both 3D DEM and World Map)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || demGrid.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Canvas background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (isLight) {
      bgGrad.addColorStop(0, "#f3eee5");
      bgGrad.addColorStop(1, "#e6ded1");
    } else {
      bgGrad.addColorStop(0, "#070e1c");
      bgGrad.addColorStop(1, "#02050c");
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // ==========================================
    // RENDER MODE 1: 🌍 WORLD MAP GEOSPATIAL VIEW
    // ==========================================
    if (isWorldView) {
      const centerX = width / 2;
      const centerY = height / 2 + 10;
      const baseRadius = Math.min(width, height) * 0.42 * worldZoom;

      // Projection: Geographic lat/lon to Canvas coordinates
      // Centered on the Indian Ocean & Polar Corridor (~60° E Longitude)
      const centerLon = 55 + (rotationAngle - 45) * 0.5;
      const centerLat = -15 + (tiltAngle - 55) * 0.4;

      const projectGeo = (lat: number, lon: number) => {
        // Spherical/Orthographic transformation
        const lambda = ((lon - centerLon) * Math.PI) / 180;
        const phi = (lat * Math.PI) / 180;
        const phi0 = (centerLat * Math.PI) / 180;

        const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda);
        const k = 1.0;

        const x = centerX + baseRadius * k * Math.cos(phi) * Math.sin(lambda);
        const y = centerY - baseRadius * k * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda));
        const isFront = cosC >= -0.15;

        return { x, y, isFront, cosC };
      };

      // 1. Draw Globe Atmosphere & Ocean Sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      const oceanGrad = ctx.createRadialGradient(
        centerX - baseRadius * 0.3,
        centerY - baseRadius * 0.3,
        baseRadius * 0.1,
        centerX,
        centerY,
        baseRadius
      );
      if (isLight) {
        oceanGrad.addColorStop(0, "#cbe3f7");
        oceanGrad.addColorStop(1, "#94bde0");
      } else {
        oceanGrad.addColorStop(0, "#0e2240");
        oceanGrad.addColorStop(0.7, "#061326");
        oceanGrad.addColorStop(1, "#020712");
      }
      ctx.fillStyle = oceanGrad;
      ctx.fill();
      ctx.clip();

      // Atmospheric Glow
      ctx.strokeStyle = isLight ? "rgba(56, 189, 248, 0.4)" : "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // 2. Graticules (Latitude & Longitude Grid Lines)
      ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(56, 189, 248, 0.12)";
      ctx.lineWidth = 1;

      // Parallels (Latitudes: -80, -60, -30, 0, 30, 60, 80)
      [-80, -66.5, -40, -20, 0, 20, 40, 66.5, 80].forEach((lat) => {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = projectGeo(lat, lon);
          if (pt.isFront) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      });

      // Meridians (Longitudes: every 30 degrees)
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -88; lat <= 88; lat += 4) {
          const pt = projectGeo(lat, lon);
          if (pt.isFront) {
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Equator highlight
      ctx.strokeStyle = isLight ? "rgba(245, 158, 11, 0.3)" : "rgba(245, 158, 11, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      let eqStarted = false;
      for (let lon = -180; lon <= 180; lon += 4) {
        const pt = projectGeo(0, lon);
        if (pt.isFront) {
          if (!eqStarted) {
            ctx.moveTo(pt.x, pt.y);
            eqStarted = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          eqStarted = false;
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Continent Polygons (Geospatial Command Center Styling)
      const LAND_MASSES = [
        // India Subcontinent & South Asia
        {
          name: "India & South Asia",
          coords: [
            [28, 70], [35, 76], [32, 80], [28, 88], [24, 94], [21, 88],
            [17, 83], [13, 80], [8, 77.5], [10, 76], [15, 74], [19, 72.8],
            [23, 68.5], [25, 68],
          ],
          color: isLight ? "#d1fae5" : "#0d3326",
          stroke: "#10b981",
        },
        // Africa Continent
        {
          name: "Africa",
          coords: [
            [37, 10], [32, 32], [12, 43], [11, 51], [0, 42], [-11, 40],
            [-26, 33], [-34.8, 20], [-34, 18.4], [-22, 14], [-5, 12],
            [5, 8], [5, 1], [15, -17], [28, -13], [35, -5],
          ],
          color: isLight ? "#e2e8f0" : "#111f38",
          stroke: "#334155",
        },
        // Antarctica Ice Cap & Polar Plateau
        {
          name: "Antarctica Ice Cap",
          coords: [
            [-64, -60], [-68, -40], [-71, 0], [-70.8, 12], [-69, 30],
            [-68, 60], [-69.4, 76.2], [-66, 95], [-67, 130], [-72, 165],
            [-78, 180], [-82, -160], [-75, -120], [-72, -90], [-65, -65],
          ],
          color: isLight ? "#ffffff" : "#1e3a5f",
          stroke: "#38bdf8",
        },
        // Eurasia (North)
        {
          name: "Eurasia",
          coords: [
            [40, 28], [50, 40], [55, 60], [60, 90], [65, 120], [60, 150],
            [45, 135], [35, 120], [22, 105], [30, 95], [35, 75], [38, 50],
          ],
          color: isLight ? "#e2e8f0" : "#13233a",
          stroke: "#334155",
        },
        // Australia
        {
          name: "Australia",
          coords: [
            [-12, 130], [-15, 136], [-12, 142], [-24, 153], [-37, 150],
            [-38, 140], [-32, 128], [-35, 116], [-22, 114], [-16, 124],
          ],
          color: isLight ? "#e2e8f0" : "#111f38",
          stroke: "#334155",
        },
      ];

      LAND_MASSES.forEach((land) => {
        ctx.beginPath();
        let valid = false;
        land.coords.forEach(([lat, lon], idx) => {
          const pt = projectGeo(lat, lon);
          if (idx === 0) {
            ctx.moveTo(pt.x, pt.y);
            valid = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        });
        ctx.closePath();
        ctx.fillStyle = land.color;
        ctx.fill();
        ctx.strokeStyle = land.stroke;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // 4. Draw Expedition Route Lines:
      // Segment 1: India (Goa) ➔ Cape Town
      // Segment 2: Cape Town ➔ MV Vasiliy Golovnin (Southern Ocean)
      // Segment 3: MV Vasiliy Golovnin ➔ Maitri Base & Bharati Base
      const ROUTE_WAYPOINTS = [
        { lat: 15.4, lon: 73.8, label: "India (Goa)" },
        { lat: 0, lon: 60.0, label: "Equator Crossing" },
        { lat: -20.0, lon: 57.5, label: "Mauritius Waters" },
        { lat: -33.9, lon: 18.4, label: "Cape Town Gateway" },
        { lat: -48.0, lon: 32.0, label: "Roaring 40s" },
        { lat: -58.5, lon: 48.2, label: "MV Vasiliy Golovnin" },
        { lat: -66.0, lon: 30.0, label: "Prydz Ice Margin" },
        { lat: -70.76, lon: 11.73, label: "Maitri Station" },
      ];

      // Secondary route branch to Bharati Base
      const BHARATI_BRANCH = [
        { lat: -58.5, lon: 48.2 },
        { lat: -64.0, lon: 65.0 },
        { lat: -69.41, lon: 76.19 }, // Bharati
      ];

      // Draw Main Route Curve
      ctx.beginPath();
      let routeStarted = false;
      for (let i = 0; i < ROUTE_WAYPOINTS.length; i++) {
        const pt = projectGeo(ROUTE_WAYPOINTS[i].lat, ROUTE_WAYPOINTS[i].lon);
        if (pt.isFront) {
          if (!routeStarted) {
            ctx.moveTo(pt.x, pt.y);
            routeStarted = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      }
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3.0;
      ctx.setLineDash([8, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Bharati Branch
      ctx.beginPath();
      let bStarted = false;
      BHARATI_BRANCH.forEach((wp) => {
        const pt = projectGeo(wp.lat, wp.lon);
        if (pt.isFront) {
          if (!bStarted) {
            ctx.moveTo(pt.x, pt.y);
            bStarted = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      });
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Animated energy particle moving southwards along route
      const totalSegs = ROUTE_WAYPOINTS.length - 1;
      const currentSegIndex = Math.min(totalSegs - 1, Math.floor(particleOffset * totalSegs));
      const segT = (particleOffset * totalSegs) - currentSegIndex;
      const p1 = ROUTE_WAYPOINTS[currentSegIndex];
      const p2 = ROUTE_WAYPOINTS[currentSegIndex + 1];
      const curLat = p1.lat + (p2.lat - p1.lat) * segT;
      const curLon = p1.lon + (p2.lon - p1.lon) * segT;
      const pulsePt = projectGeo(curLat, curLon);

      if (pulsePt.isFront) {
        ctx.beginPath();
        ctx.arc(pulsePt.x, pulsePt.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pulsePt.x, pulsePt.y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 5. Draw Polar Expedition Points & Markers
      WORLD_EXPEDITION_POINTS.forEach((p) => {
        const pt = projectGeo(p.lat, p.lon);
        if (!pt.isFront) return;

        const isSelected = selectedWorldPoint?.id === p.id;

        // Pulsing Beacon Ring
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isSelected ? 12 : 8, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Outer Beacon Ring
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isSelected ? 20 : 14, 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pin Vertical Stem
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x, pt.y - 14);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label Badge
        ctx.font = "bold 11px JetBrains Mono, monospace";
        const textWidth = ctx.measureText(p.name).width;
        
        ctx.fillStyle = isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(3, 7, 18, 0.9)";
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(pt.x + 8, pt.y - 24, textWidth + 16, 20, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isLight ? "#0f172a" : "#f8fafc";
        ctx.fillText(p.name, pt.x + 16, pt.y - 10);
      });

      ctx.restore(); // Restore ocean clip
    } 
    // ==========================================
    // RENDER MODE 2: 🏔️ 3D DEM TOPOGRAPHIC MESH
    // ==========================================
    else {
      const rad = (rotationAngle * Math.PI) / 180;
      const cosR = Math.cos(rad);
      const sinR = Math.sin(rad);
      const tiltRad = (tiltAngle * Math.PI) / 180;
      const cosT = Math.cos(tiltRad);
      const sinT = Math.sin(tiltRad);

      const centerX = width / 2;
      const centerY = height / 2 + 30;
      const scale = 14;

      const project = (x: number, y: number, z: number) => {
        const cx = (x - GRID_SIZE / 2) * scale;
        const cy = (y - GRID_SIZE / 2) * scale;
        const cz = z * (elevationScale * 0.45);

        const rx = cx * cosR - cy * sinR;
        const ry = cx * sinR + cy * cosR;

        const px = centerX + rx;
        const py = centerY + ry * cosT - cz * sinT;
        return { px, py, depth: ry * sinT + cz * cosT };
      };

      const isLayerActive = (type: GisFeatureLayer["type"]) =>
        layers.find((l) => l.type === type)?.enabled ?? false;

      // Draw Polygons from back to front
      for (let y = 0; y < GRID_SIZE - 1; y++) {
        for (let x = 0; x < GRID_SIZE - 1; x++) {
          const p00 = demGrid[y][x];
          const p10 = demGrid[y][x + 1];
          const p11 = demGrid[y + 1][x + 1];
          const p01 = demGrid[y + 1][x];

          const pr00 = project(x, y, p00.elevationM);
          const pr10 = project(x + 1, y, p10.elevationM);
          const pr11 = project(x + 1, y + 1, p11.elevationM);
          const pr01 = project(x, y + 1, p01.elevationM);

          const avgElev = (p00.elevationM + p10.elevationM + p11.elevationM + p01.elevationM) / 4;
          const avgWater = (p00.inundationLevelM + p10.inundationLevelM + p11.inundationLevelM + p01.inundationLevelM) / 4;
          const avgVuln = (p00.vulnerabilityScore + p10.vulnerabilityScore + p11.vulnerabilityScore + p01.vulnerabilityScore) / 4;

          ctx.beginPath();
          ctx.moveTo(pr00.px, pr00.py);
          ctx.lineTo(pr10.px, pr10.py);
          ctx.lineTo(pr11.px, pr11.py);
          ctx.lineTo(pr01.px, pr01.py);
          ctx.closePath();

          if (renderMode === "WIREFRAME") {
            ctx.strokeStyle = isLight ? "#94a3b8" : "#38bdf8";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          } else if (renderMode === "HEATMAP" || isLayerActive("VULNERABILITY_HEATMAP")) {
            const hue = Math.max(0, 120 - avgVuln * 1.2);
            ctx.fillStyle = `hsla(${hue}, 85%, 45%, 0.75)`;
            ctx.fill();
            ctx.strokeStyle = isLight ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          } else {
            let baseCol = "";
            if (avgElev < 50) baseCol = isLight ? "#d1d5db" : "#1e293b";
            else if (avgElev < 90) baseCol = isLight ? "#93c5fd" : "#0284c7";
            else if (avgElev < 130) baseCol = isLight ? "#bfdbfe" : "#38bdf8";
            else baseCol = isLight ? "#ffffff" : "#f1f5f9";

            if (isLayerActive("INUNDATION_ZONE") && avgWater > 0.3) {
              ctx.fillStyle = `rgba(14, 165, 233, ${Math.min(0.9, 0.4 + avgWater * 0.25)})`;
            } else {
              ctx.fillStyle = baseCol;
            }
            ctx.fill();

            ctx.strokeStyle = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw 3D Overlays: Rainfall radar
      if (isLayerActive("RAINFALL_RADAR") && rainfallRateMmH > 10) {
        const stormCells = [
          { gx: 6, gy: 8, r: 40 },
          { gx: 20, gy: 18, r: 60 },
        ];
        stormCells.forEach((cell) => {
          const p = project(cell.gx, cell.gy, 60);
          ctx.beginPath();
          ctx.arc(p.px, p.py, cell.r * (rainfallRateMmH / 70), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(56, 189, 248, 0.2)";
          ctx.fill();
          ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      // Evacuation Routes
      if (isLayerActive("EVACUATION_ROUTE")) {
        const route1Coords = [
          { gx: 4, gy: 22, z: 35 },
          { gx: 10, gy: 16, z: 75 },
          { gx: 14, gy: 12, z: 117 },
        ];
        ctx.beginPath();
        const start = project(route1Coords[0].gx, route1Coords[0].gy, route1Coords[0].z);
        ctx.moveTo(start.px, start.py);
        for (let i = 1; i < route1Coords.length; i++) {
          const pt = project(route1Coords[i].gx, route1Coords[i].gy, route1Coords[i].z);
          ctx.lineTo(pt.px, pt.py);
        }
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 3.5;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Safe Shelters Icons on 3D Surface
      if (isLayerActive("SHELTER_SAFE_SITE")) {
        const shelterMarkers = [
          { gx: 14, gy: 12, z: 117, name: "Maitri Base Hub", color: "#10b981" },
          { gx: 22, gy: 20, z: 85, name: "Bharati Cryo-Habitat", color: "#06b6d4" },
          { gx: 8, gy: 6, z: 140, name: "Refuge Hut 04", color: "#f59e0b" },
        ];
        shelterMarkers.forEach((sh) => {
          const pt = project(sh.gx, sh.gy, sh.z);
          ctx.beginPath();
          ctx.arc(pt.px, pt.py - 12, 6, 0, Math.PI * 2);
          ctx.fillStyle = sh.color;
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(pt.px, pt.py - 6);
          ctx.lineTo(pt.px, pt.py);
          ctx.strokeStyle = sh.color;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.font = "bold 10px JetBrains Mono, monospace";
          ctx.fillStyle = isLight ? "#0f172a" : "#f8fafc";
          ctx.fillText(sh.name, pt.px + 10, pt.py - 8);
        });
      }
    }
  }, [
    demGrid,
    rotationAngle,
    tiltAngle,
    elevationScale,
    renderMode,
    layers,
    rainfallRateMmH,
    simHour,
    isLight,
    isWorldView,
    worldZoom,
    selectedWorldPoint,
    particleOffset,
  ]);

  // Mouse drag handler for intuitive canvas rotation in both 3D DEM and World View
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setRotationAngle((prev) => (prev + dx * 0.5 + 360) % 360);
    setTiltAngle((prev) => Math.min(85, Math.max(15, prev - dy * 0.4)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const toggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, enabled: !l.enabled } : l))
    );
  };

  // Simulation Computed Impact
  const inundatedAreaKm2 = (rainfallRateMmH * 0.12 * (simHour / 10)).toFixed(1);
  const atRiskPopulation = Math.min(160, Math.round(rainfallRateMmH * 0.45 * (simHour / 6)));
  const blockedCorridorsCount = rainfallRateMmH > 80 && simHour > 12 ? 2 : rainfallRateMmH > 40 && simHour > 6 ? 1 : 0;

  return (
    <div className="space-y-4">
      {/* Top Banner with Simulation Controls & Status */}
      <div
        className={`p-4 rounded-2xl border backdrop-blur-md shadow-lg transition ${
          isLight
            ? "bg-[#faf8f5] border-[#e8e2d8] text-slate-800"
            : "bg-[#0b1326]/90 border-slate-800 text-slate-100"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {isWorldView ? "Geospatial Command • Global View" : "3D GIS & DEM Topographic Model"}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {isWorldView
                  ? "Global Polar Artery: India (Goa) ➔ Southern Ocean ➔ Antarctica (Maitri & Bharati)"
                  : "Resolution: 10m DEM Mesh • Coordinate System: WGS 84 / Polar Stereographic"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black font-mono tracking-tight mt-1 flex items-center gap-2">
              {isWorldView ? (
                <>
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <span>Global Polar Expedition Route & Station Network</span>
                </>
              ) : (
                <>
                  <Mountain className="w-5 h-5 text-cyan-500" />
                  <span>Hydrological Inundation & Multi-Hazard Terrain Simulator</span>
                </>
              )}
            </h2>
          </div>

          {/* Time Step & Playback Bar */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-700 text-xs font-mono">
            <button
              onClick={() => setIsPlayingSim(!isPlayingSim)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                isPlayingSim
                  ? "bg-amber-600 text-white animate-pulse"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white"
              }`}
            >
              {isPlayingSim ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingSim ? "PAUSE SIM" : "RUN SIMULATION"}</span>
            </button>

            <button
              onClick={() => {
                setIsPlayingSim(false);
                setSimHour(0);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              title="Reset Timeline to T+0h"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="px-2 text-cyan-300 font-bold">
              T+{simHour}h <span className="text-slate-500 text-[10px]">/ T+24h</span>
            </div>

            <input
              type="range"
              min={0}
              max={24}
              value={simHour}
              onChange={(e) => setSimHour(Number(e.target.value))}
              className="w-24 sm:w-32 accent-cyan-500"
            />
          </div>
        </div>

        {/* Live Simulation Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-700/40 text-xs font-mono">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">{isWorldView ? "Total Route Dist:" : "Rainfall / Melt Rate:"}</span>
            <span className="text-cyan-400 font-bold">{isWorldView ? "~11,850 km" : `${rainfallRateMmH} mm/h`}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">{isWorldView ? "Fleet Heading:" : "Inundated Area:"}</span>
            <span className="text-sky-400 font-bold">{isWorldView ? "198° SSW" : `${inundatedAreaKm2} km²`}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">{isWorldView ? "Active Bases:" : "At-Risk Crew:"}</span>
            <span className={`font-bold ${!isWorldView && atRiskPopulation > 30 ? "text-red-400" : "text-emerald-400"}`}>
              {isWorldView ? "3 Permanent (MTR/BHR/HMD)" : `${atRiskPopulation} Persons`}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">{isWorldView ? "Expedition Fleet:" : "Traverse Cutoffs:"}</span>
            <span className="font-bold text-cyan-300">
              {isWorldView ? "MV Vasiliy Golovnin" : `${blockedCorridorsCount} Blocked`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Canvas Screen + Controls/Layers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Canvas Screen */}
        <div
          className={`lg:col-span-8 rounded-2xl border p-3 shadow-xl relative overflow-hidden flex flex-col justify-between ${
            isLight
              ? "bg-[#faf8f5] border-[#e8e2d8]"
              : "bg-[#070e1c] border-slate-800"
          }`}
        >
          {/* Top Canvas Controls Toolbar */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none z-10 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 text-xs font-mono shadow-md">
              <span className="text-[10px] text-slate-400 uppercase px-1">View:</span>
              {(["MESH", "WIREFRAME", "HEATMAP"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setIsWorldView(false);
                    setRenderMode(m);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                    !isWorldView && renderMode === m
                      ? "bg-cyan-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {m === "MESH" ? "3D MESH" : m}
                </button>
              ))}

              <div className="w-[1px] h-4 bg-slate-700 mx-1" />

              {/* 🌍 WORLD MAP BUTTON */}
              <button
                id="btn-gis-world-map"
                onClick={triggerWorldTransition}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-black tracking-wide transition ${
                  isWorldView
                    ? "bg-emerald-600 text-white border border-emerald-400 shadow-md shadow-emerald-950"
                    : "bg-slate-900 text-emerald-400 hover:bg-emerald-950/60 border border-emerald-500/40"
                }`}
                title="Switch camera to full-world Earth geographic view showing India → Antarctica expedition route"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🌍 WORLD MAP</span>
              </button>
            </div>

            {/* Quick Switch / Compass Toolbar */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {isWorldView && (
                <button
                  onClick={() => {
                    setIsWorldView(false);
                  }}
                  className="bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/60 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 shadow-md transition"
                  title="Return to Local 3D DEM Topographic Elevation Model"
                >
                  <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                  <span>RESET / 3D VIEW</span>
                </button>
              )}

              {/* Zoom In/Out for World Map */}
              {isWorldView && (
                <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setWorldZoom((z) => Math.min(1.6, z + 0.15))}
                    className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setWorldZoom((z) => Math.max(0.7, z - 0.15))}
                    className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Compass Heading Indicator */}
              <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono text-slate-200 shadow-md">
                <Compass
                  className="w-4 h-4 text-cyan-400 transition-transform duration-300"
                  style={{ transform: `rotate(${-rotationAngle}deg)` }}
                />
                <span>{rotationAngle}° N</span>
              </div>
            </div>
          </div>

          {/* HTML5 Canvas Element with Interactive Drag */}
          <div className="w-full flex items-center justify-center my-auto min-h-[380px] sm:min-h-[440px] relative">
            <canvas
              ref={canvasRef}
              width={750}
              height={440}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-auto max-h-[460px] rounded-xl cursor-grab active:cursor-grabbing shadow-inner"
            />

            {/* In-Canvas World View Overlay Callout Badge */}
            {isWorldView && (
              <div className="absolute bottom-3 left-4 bg-slate-950/90 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl text-xs font-mono max-w-sm pointer-events-none">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>EXPEDITION ARTERY: INDIA ➔ ANTARCTICA</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-tight">
                  NCPOR Goa (15.4°N) ➔ Cape Town ➔ MV Vasiliy Golovnin ➔ Maitri (70.8°S) & Bharati (69.4°S)
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                  <span>Drag canvas to rotate globe</span>
                  <span>•</span>
                  <span>WGS 84 Orthographic Model</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Floating Interactive Sliders (Rotation, Tilt, Elevation) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-700/30 text-xs font-mono">
            <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase">Rotate:</span>
              <input
                type="range"
                min={0}
                max={360}
                value={rotationAngle}
                onChange={(e) => setRotationAngle(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <span className="text-cyan-300 w-8 text-right font-bold">{rotationAngle}°</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase">Tilt:</span>
              <input
                type="range"
                min={20}
                max={85}
                value={tiltAngle}
                onChange={(e) => setTiltAngle(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <span className="text-cyan-300 w-8 text-right font-bold">{tiltAngle}°</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase">
                {isWorldView ? "Zoom:" : "Z-Scale:"}
              </span>
              <input
                type="range"
                min={isWorldView ? 0.7 : 0.5}
                max={isWorldView ? 1.6 : 3.0}
                step={0.1}
                value={isWorldView ? worldZoom : elevationScale}
                onChange={(e) =>
                  isWorldView
                    ? setWorldZoom(Number(e.target.value))
                    : setElevationScale(Number(e.target.value))
                }
                className="w-full accent-cyan-500"
              />
              <span className="text-cyan-300 w-8 text-right font-bold">
                {isWorldView ? `${worldZoom.toFixed(1)}x` : `${elevationScale}x`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Layers Switcher & Safe Sites or World Route Waypoints */}
        <div className="lg:col-span-4 space-y-4">
          {/* If World Map is active, show Global Expedition Points */}
          {isWorldView ? (
            <div
              className={`p-4 rounded-2xl border shadow-md space-y-3 ${
                isLight
                  ? "bg-[#faf8f5] border-[#e8e2d8]"
                  : "bg-[#0b1326]/90 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                <div className="flex items-center gap-1.5 font-mono font-bold text-xs uppercase text-emerald-400">
                  <Anchor className="w-4 h-4" />
                  <span>Expedition Corridor Waypoints</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">6 Key Nodes</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {WORLD_EXPEDITION_POINTS.map((wp) => (
                  <div
                    key={wp.id}
                    onClick={() => setSelectedWorldPoint(wp)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition ${
                      selectedWorldPoint?.id === wp.id
                        ? "bg-slate-900 border-emerald-500 shadow-sm"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: wp.color }}
                        />
                        <span className="text-xs font-mono font-bold text-white">
                          {wp.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                        {wp.lat > 0 ? `${wp.lat}°N` : `${Math.abs(wp.lat)}°S`},{" "}
                        {wp.lon > 0 ? `${wp.lon}°E` : `${Math.abs(wp.lon)}°W`}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1 pl-4">
                      {wp.details}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-700/40">
                <button
                  onClick={() => setIsWorldView(false)}
                  className="w-full py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 font-mono text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Mountain className="w-4 h-4 text-cyan-400" />
                  <span>Switch to Local 3D DEM Terrain</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Layer Controls Panel */}
              <div
                className={`p-4 rounded-2xl border shadow-md space-y-3 ${
                  isLight
                    ? "bg-[#faf8f5] border-[#e8e2d8]"
                    : "bg-[#0b1326]/90 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-xs uppercase">
                    <Layers className="w-4 h-4 text-cyan-500" />
                    <span>GIS Overlays & Layers</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">5 Active Layers</span>
                </div>

                <div className="space-y-2">
                  {layers.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => toggleLayer(l.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                        l.enabled
                          ? isLight
                            ? "bg-white border-cyan-400 shadow-xs"
                            : "bg-slate-900 border-cyan-500/50"
                          : "bg-slate-950/40 border-slate-800/60 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: l.color }}
                        />
                        <span className="text-xs font-mono font-semibold">{l.name}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={l.enabled}
                        onChange={() => {}}
                        className="accent-cyan-500 rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {/* Rainfall Rate Slider */}
                <div className="pt-2 border-t border-slate-700/40 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1 text-slate-400">
                      <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                      <span>Rainfall / Melt Intensity</span>
                    </span>
                    <span className="text-sky-400 font-bold">{rainfallRateMmH} mm/h</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={150}
                    value={rainfallRateMmH}
                    onChange={(e) => setRainfallRateMmH(Number(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>0 mm/h (Nominal)</span>
                    <span>75 mm/h (Heavy)</span>
                    <span>150 mm/h (Extreme)</span>
                  </div>
                </div>
              </div>

              {/* Shelter Quick Telemetry Card */}
              <div
                className={`p-4 rounded-2xl border shadow-md space-y-3 ${
                  isLight
                    ? "bg-[#faf8f5] border-[#e8e2d8]"
                    : "bg-[#0b1326]/90 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-xs uppercase text-amber-500">
                    <Home className="w-4 h-4" />
                    <span>Designated Safe Shelters</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {MOCK_SAFE_SHELTERS.map((shelter) => (
                    <div
                      key={shelter.id}
                      onClick={() => {
                        setActiveShelterDetail(shelter);
                        if (onSelectShelter) onSelectShelter(shelter);
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer transition ${
                        activeShelterDetail?.id === shelter.id
                          ? "bg-slate-900 border-amber-500"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-white line-clamp-1">
                          {shelter.name}
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          {shelter.currentOccupancy}/{shelter.maxCapacity} Beds
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                        <span>Elev: {shelter.elevationM}m</span>
                        <span>Water: {shelter.potableWaterLiters.toLocaleString()}L</span>
                        <span>Rations: {shelter.rationsDays}d</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
