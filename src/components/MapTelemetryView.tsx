import React, { useState, useEffect, useMemo } from "react";
import { Asset, TelemetryPoint, WeatherData, Language } from "../types";
import { translations } from "../i18n";
import { 
  Compass, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  ShieldAlert, 
  Radio, 
  Navigation,
  BatteryCharging,
  Activity,
  Flame,
  Sliders,
  Info,
  X,
  TrendingUp,
  MapPin
} from "lucide-react";

interface MapTelemetryViewProps {
  assets: Asset[];
  telemetryHistory: TelemetryPoint[];
  liveWeather: WeatherData | null;
  currentStation: string;
  language: Language;
  onSelectAsset: (asset: Asset) => void;
  onTriggerSosForAsset?: (assetId: string) => void;
}

interface PolarTrafficCorridor {
  id: string;
  name: string;
  region: "ANTARCTICA" | "ARCTIC";
  densityLevel: "CRITICAL_PEAK" | "HIGH" | "MEDIUM" | "MODERATE";
  pingCount: number;
  avgTraverseSpeedKmH: number;
  dominantAssetClass: string;
  hazardRating: "LOW" | "ELEVATED" | "HIGH_CREVASSE" | "ICE_DRIFT";
  description: string;
  svgPath: string;
  hotspotCoord: { x: number; y: number };
  nodes: { x: number; y: number; intensity: number; radius: number }[];
}

const HISTORICAL_CORRIDORS: PolarTrafficCorridor[] = [
  {
    id: "CORR-MTR-SCHIRMACHER",
    name: "Schirmacher Oasis — Blue Ice Runway Corridor",
    region: "ANTARCTICA",
    densityLevel: "CRITICAL_PEAK",
    pingCount: 5420,
    avgTraverseSpeedKmH: 14.8,
    dominantAssetClass: "PistenBully Snowcat & Heavy Sledges",
    hazardRating: "HIGH_CREVASSE",
    description: "Primary logistics pipeline between Maitri Station and the Blue Ice Airstrip with intensive multi-season heavy supply traverses.",
    svgPath: "M330 220 C340 215, 360 210, 380 215 C400 220, 410 230, 425 240",
    hotspotCoord: { x: 365, y: 218 },
    nodes: [
      { x: 330, y: 220, intensity: 0.95, radius: 28 },
      { x: 350, y: 216, intensity: 0.90, radius: 32 },
      { x: 375, y: 218, intensity: 0.85, radius: 30 },
      { x: 400, y: 226, intensity: 0.75, radius: 26 },
      { x: 425, y: 240, intensity: 0.70, radius: 24 },
    ],
  },
  {
    id: "CORR-TRANS-CONTINENTAL",
    name: "Maitri ➔ Bharati Trans-Continental Artery",
    region: "ANTARCTICA",
    densityLevel: "HIGH",
    pingCount: 3890,
    avgTraverseSpeedKmH: 18.5,
    dominantAssetClass: "Multi-Unit Polar Traverse Convoys",
    hazardRating: "ELEVATED",
    description: "Long-distance traverse spine connecting Queen Maud Land (Maitri) across East Antarctic Plateau to Larsemann Hills (Bharati).",
    svgPath: "M330 220 Q425 245 520 270",
    hotspotCoord: { x: 430, y: 248 },
    nodes: [
      { x: 330, y: 220, intensity: 0.90, radius: 26 },
      { x: 380, y: 232, intensity: 0.65, radius: 24 },
      { x: 425, y: 245, intensity: 0.80, radius: 28 },
      { x: 475, y: 258, intensity: 0.70, radius: 24 },
      { x: 520, y: 270, intensity: 0.88, radius: 30 },
    ],
  },
  {
    id: "CORR-PRYDZ-BHARATI",
    name: "Prydz Bay Marine Approach & Fast-Ice Channel",
    region: "ANTARCTICA",
    densityLevel: "CRITICAL_PEAK",
    pingCount: 4610,
    avgTraverseSpeedKmH: 8.2,
    dominantAssetClass: "MV Vasiliy Golovnin & Polar Barges",
    hazardRating: "ICE_DRIFT",
    description: "Maritime and fast-ice offloading lane from coastal ice-edge moorings to Bharati Station scientific habitat.",
    svgPath: "M560 215 C545 235, 535 250, 520 270",
    hotspotCoord: { x: 538, y: 245 },
    nodes: [
      { x: 565, y: 215, intensity: 0.92, radius: 32 },
      { x: 545, y: 238, intensity: 0.88, radius: 28 },
      { x: 520, y: 270, intensity: 0.95, radius: 30 },
      { x: 505, y: 285, intensity: 0.60, radius: 22 },
    ],
  },
  {
    id: "CORR-DG-COASTAL",
    name: "Dakshin Gangotri Ice Shelf Staging Corridor",
    region: "ANTARCTICA",
    densityLevel: "MEDIUM",
    pingCount: 2140,
    avgTraverseSpeedKmH: 12.0,
    dominantAssetClass: "Fuel Tanker Sledges & AWS Inspection",
    hazardRating: "HIGH_CREVASSE",
    description: "Historical coastal depot resupply and automated weather array maintenance traverse.",
    svgPath: "M330 220 L310 250 L285 275",
    hotspotCoord: { x: 305, y: 252 },
    nodes: [
      { x: 330, y: 220, intensity: 0.75, radius: 24 },
      { x: 310, y: 250, intensity: 0.65, radius: 22 },
      { x: 285, y: 275, intensity: 0.55, radius: 20 },
    ],
  },
  // Arctic Corridors
  {
    id: "CORR-HIMADRI-KONGSFJORDEN",
    name: "Kongsfjorden Cryo-Marine Survey Transect",
    region: "ARCTIC",
    densityLevel: "CRITICAL_PEAK",
    pingCount: 3720,
    avgTraverseSpeedKmH: 16.4,
    dominantAssetClass: "Research Boats, UAVs & Snowmobiles",
    hazardRating: "ICE_DRIFT",
    description: "Ny-Ålesund central marine and aerosol profiling transect extending to IndARC mooring.",
    svgPath: "M410 250 C430 230, 460 220, 480 240 C460 270, 435 285, 410 250",
    hotspotCoord: { x: 445, y: 235 },
    nodes: [
      { x: 410, y: 250, intensity: 0.95, radius: 30 },
      { x: 435, y: 232, intensity: 0.85, radius: 26 },
      { x: 465, y: 230, intensity: 0.75, radius: 24 },
      { x: 480, y: 260, intensity: 0.80, radius: 28 },
      { x: 420, y: 240, intensity: 0.90, radius: 25 },
    ],
  },
  {
    id: "CORR-LOVENBREEN-GLACIER",
    name: "Midtre Lovénbreen Glacier Traverse Path",
    region: "ARCTIC",
    densityLevel: "HIGH",
    pingCount: 2280,
    avgTraverseSpeedKmH: 9.6,
    dominantAssetClass: "Field Glaciology Snowmobiles & Pulks",
    hazardRating: "HIGH_CREVASSE",
    description: "Glaciological mass-balance ablation stake monitoring route across Midtre Lovénbreen.",
    svgPath: "M410 250 L380 290 L360 320",
    hotspotCoord: { x: 385, y: 285 },
    nodes: [
      { x: 410, y: 250, intensity: 0.80, radius: 24 },
      { x: 385, y: 285, intensity: 0.75, radius: 22 },
      { x: 360, y: 320, intensity: 0.60, radius: 20 },
    ],
  },
];

export const MapTelemetryView: React.FC<MapTelemetryViewProps> = ({
  assets,
  telemetryHistory,
  liveWeather,
  currentStation,
  language,
  onSelectAsset,
}) => {
  const t = translations[language];
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || "");
  const [showIceOverlay, setShowIceOverlay] = useState<boolean>(true);
  const [showAspaGeofence, setShowAspaGeofence] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [heatmapIntensity, setHeatmapIntensity] = useState<number>(0.85);
  const [selectedCorridorId, setSelectedCorridorId] = useState<string | null>(null);
  const [isPlayingPlayback, setIsPlayingPlayback] = useState<boolean>(false);
  const [playbackIndex, setPlaybackIndex] = useState<number>(telemetryHistory.length - 1);
  const [activeProjection, setActiveProjection] = useState<"ANTARCTICA" | "ARCTIC">(
    currentStation === "HIMADRI" ? "ARCTIC" : "ANTARCTICA"
  );

  useEffect(() => {
    if (currentStation === "HIMADRI") {
      setActiveProjection("ARCTIC");
    } else {
      setActiveProjection("ANTARCTICA");
    }
  }, [currentStation]);

  useEffect(() => {
    setPlaybackIndex(telemetryHistory.length - 1);
  }, [telemetryHistory.length]);

  // Playback timer
  useEffect(() => {
    let timer: any;
    if (isPlayingPlayback) {
      timer = setInterval(() => {
        setPlaybackIndex((prev) => {
          if (prev >= telemetryHistory.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlayingPlayback, telemetryHistory.length]);

  useEffect(() => {
    if (!selectedAssetId && assets.length > 0) {
      setSelectedAssetId(assets[0].id);
    }
  }, [assets, selectedAssetId]);

  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0] || null;
  const currentPlaybackPoint = telemetryHistory[playbackIndex] || telemetryHistory[telemetryHistory.length - 1];

  // Active projection corridors
  const activeCorridors = useMemo(() => {
    return HISTORICAL_CORRIDORS.filter((c) => c.region === activeProjection);
  }, [activeProjection]);

  const selectedCorridor = useMemo(() => {
    return HISTORICAL_CORRIDORS.find((c) => c.id === selectedCorridorId) || null;
  }, [selectedCorridorId]);

  // ASPA Geofence alert check: ASPA No. 136 (Schirmacher Oasis) coordinates ~ -70.75, 11.70
  const isInsideAspaAlert = assets.some(
    (a) => Math.abs(a.latitude - -70.75) < 0.08 && Math.abs(a.longitude - 11.7) < 0.15
  );

  const totalRegionalPings = useMemo(() => {
    return activeCorridors.reduce((acc, c) => acc + c.pingCount, 0) + telemetryHistory.length * 15;
  }, [activeCorridors, telemetryHistory.length]);

  return (
    <div className="space-y-4">
      {/* Top Polar Live Weather & Atmospheric Grounding Bar */}
      <div
        id="polar-weather-bar"
        className={`p-3.5 rounded-xl border transition-all ${
          liveWeather?.current.blizzardAlert
            ? "bg-amber-500/10 border-amber-300 text-amber-950"
            : "bg-white border-slate-200 text-slate-900"
        } shadow-xs`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 text-sky-800 rounded-lg">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                  {liveWeather?.stationName || currentStation}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
                  {t.realDataSource}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Lat: {liveWeather?.coordinates.latitude}° | Lon: {liveWeather?.coordinates.longitude}° | Refreshed: {new Date(liveWeather?.observedAt || "").toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Key Weather Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">{t.currentTemp}</div>
              <div className="text-base font-bold text-slate-900">
                {liveWeather?.current.temperatureC ?? -24.5}°C
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">{t.windChill}</div>
              <div className="text-base font-bold text-sky-700">
                {liveWeather?.current.windChillC ?? -36.2}°C
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">{t.windSpeed}</div>
              <div className="text-base font-bold text-slate-900 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-slate-400" />
                {liveWeather?.current.windSpeedKmh ?? 38} km/h
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">{t.seaIceConcentration}</div>
              <div className="text-base font-bold text-indigo-700">
                {liveWeather?.current.seaIceConcentrationPct ?? 88}%
              </div>
            </div>
          </div>

          {/* Blizzard Advisory Flag */}
          {liveWeather?.current.blizzardAlert && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg animate-pulse shadow-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>{t.blizzardWarning}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Interactive Polar Map Stage + Telemetry Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Stage */}
        <div className="lg:col-span-8 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-3.5 flex flex-col shadow-md relative overflow-hidden">
          {/* Map Header & Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <span className="font-bold tracking-tight text-white uppercase">
                {activeProjection === "ANTARCTICA"
                  ? "Antarctic Polar Grid (South Pole Stereographic Projection)"
                  : "Arctic Ocean & Svalbard Archipelago Grid"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Region Toggle */}
              <button
                id="btn-toggle-antarctica"
                onClick={() => {
                  setActiveProjection("ANTARCTICA");
                  setSelectedCorridorId(null);
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  activeProjection === "ANTARCTICA"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Antarctica
              </button>
              <button
                id="btn-toggle-arctic"
                onClick={() => {
                  setActiveProjection("ARCTIC");
                  setSelectedCorridorId(null);
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                  activeProjection === "ARCTIC"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                Arctic (Himadri)
              </button>

              {/* Density Heatmap Overlay Toggle */}
              <button
                id="btn-toggle-heatmap"
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition ${
                  showHeatmap
                    ? "bg-gradient-to-r from-amber-950 to-rose-950 border-amber-500/80 text-amber-300 shadow-sm"
                    : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
                title="Density Heatmap of Historical Telemetry & Traffic Corridors"
              >
                <Flame className={`w-3 h-3 ${showHeatmap ? "text-amber-400 animate-pulse" : ""}`} />
                <span>Heatmap</span>
                {showHeatmap && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                )}
              </button>

              {/* Layers Toggle */}
              <button
                id="btn-toggle-ice"
                onClick={() => setShowIceOverlay(!showIceOverlay)}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition ${
                  showIceOverlay
                    ? "bg-sky-950 border-sky-600 text-sky-300"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
                title="Copernicus Sea-Ice Overlay"
              >
                <Layers className="w-3 h-3" />
                Ice Overlay
              </button>
              <button
                id="btn-toggle-aspa"
                onClick={() => setShowAspaGeofence(!showAspaGeofence)}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition ${
                  showAspaGeofence
                    ? "bg-amber-950 border-amber-600 text-amber-300"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
                title="Antarctic Specially Protected Area Geofence"
              >
                <ShieldAlert className="w-3 h-3" />
                ASPA Fence
              </button>
            </div>
          </div>

          {/* Interactive SVG Polar Radar Canvas */}
          <div className="relative w-full h-[470px] my-2 bg-gradient-to-b from-slate-950 via-[#071324] to-slate-950 rounded-lg flex items-center justify-center overflow-hidden border border-slate-800/80">
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full object-contain select-none"
            >
              <defs>
                {/* Radial gradient for polar ice sheet */}
                <radialGradient id="polarGridGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0B1B33" />
                  <stop offset="70%" stopColor="#081426" />
                  <stop offset="100%" stopColor="#040914" />
                </radialGradient>

                <linearGradient id="iceShelfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.08" />
                </linearGradient>

                <linearGradient id="routeTrackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>

                {/* Heatmap Blur & Glow Filters */}
                <filter id="heatBlurFilter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
                <filter id="heatGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Heatmap Node Radial Gradients */}
                <radialGradient id="heatNodeCritical" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="#F97316" stopOpacity="0.80" />
                  <stop offset="65%" stopColor="#F59E0B" stopOpacity="0.55" />
                  <stop offset="85%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="heatNodeHigh" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.90" />
                  <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.65" />
                  <stop offset="70%" stopColor="#10B981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="heatNodeMedium" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.80" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
                </radialGradient>

                {/* Corridor Flow Gradients */}
                <linearGradient id="heatCorridorAntarctica" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
                  <stop offset="25%" stopColor="#F97316" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.70" />
                  <stop offset="85%" stopColor="#10B981" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.50" />
                </linearGradient>

                <linearGradient id="heatCorridorArctic" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.75" />
                  <stop offset="80%" stopColor="#10B981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Background circular radar grid */}
              <circle cx="400" cy="300" r="280" fill="url(#polarGridGrad)" stroke="#1E293B" strokeWidth="1.5" />
              <circle cx="400" cy="300" r="210" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="400" cy="300" r="140" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="400" cy="300" r="70" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 2" />

              {/* Coordinate crosshairs */}
              <line x1="400" y1="20" x2="400" y2="580" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="120" y1="300" x2="680" y2="300" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />

              {/* Region-Specific Geographic Contours */}
              {activeProjection === "ANTARCTICA" ? (
                <g id="antarctica-continent">
                  {/* Sea-Ice Extent (Copernicus Simulation) */}
                  {showIceOverlay && (
                    <path
                      d="M240 160 C320 110, 480 90, 580 160 C670 230, 680 380, 590 470 C500 550, 290 540, 200 450 C120 370, 160 220, 240 160 Z"
                      fill="url(#iceShelfGrad)"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                      opacity="0.7"
                    />
                  )}

                  {/* Continental Ice Mass Silhouette */}
                  <path
                    d="M320 200 C370 170, 460 170, 510 210 C560 250, 570 330, 530 390 C490 440, 390 450, 330 420 C270 390, 250 320, 270 270 C280 240, 300 210, 320 200 Z"
                    fill="#1E293B"
                    stroke="#475569"
                    strokeWidth="2"
                  />

                  {/* ASPA Protected Area Geofence */}
                  {showAspaGeofence && (
                    <g id="aspa-zone">
                      <polygon
                        points="310,200 355,195 365,235 320,240"
                        fill="#F59E0B"
                        fillOpacity="0.18"
                        stroke="#F59E0B"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      <text x="312" y="190" fill="#FBBF24" fontSize="9" fontWeight="bold">
                        ASPA-136 GEOFENCE
                      </text>
                    </g>
                  )}
                </g>
              ) : (
                /* Arctic / Svalbard Projection */
                <g id="arctic-svalbard">
                  <path
                    d="M360 220 L440 180 L480 240 L450 320 L380 340 Z"
                    fill="#1E293B"
                    stroke="#475569"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* ========================================================= */}
              {/* DENSITY HEATMAP OVERLAY LAYER (HISTORICAL TELEMETRY DENSITY) */}
              {/* ========================================================= */}
              {showHeatmap && (
                <g id="polar-density-heatmap" opacity={heatmapIntensity} className="transition-opacity duration-300">
                  {/* 1. Diffused Background Traffic Flow Ribbons */}
                  {activeCorridors.map((corridor) => (
                    <g key={`flow-${corridor.id}`}>
                      {/* Broad heat diffusion halo */}
                      <path
                        d={corridor.svgPath}
                        fill="none"
                        stroke={corridor.region === "ANTARCTICA" ? "url(#heatCorridorAntarctica)" : "url(#heatCorridorArctic)"}
                        strokeWidth={selectedCorridorId === corridor.id ? "36" : "26"}
                        strokeLinecap="round"
                        filter="url(#heatBlurFilter)"
                        opacity="0.8"
                      />
                      {/* Concentrated mid-density thermal core */}
                      <path
                        d={corridor.svgPath}
                        fill="none"
                        stroke={corridor.densityLevel === "CRITICAL_PEAK" ? "#EF4444" : "#F59E0B"}
                        strokeWidth={selectedCorridorId === corridor.id ? "12" : "7"}
                        strokeLinecap="round"
                        strokeDasharray="8 4"
                        filter="url(#heatGlowFilter)"
                        opacity="0.75"
                        className="cursor-pointer hover:opacity-100"
                        onClick={() => setSelectedCorridorId(corridor.id)}
                      />
                    </g>
                  ))}

                  {/* 2. Radial Heat Nodes along High-Ping Clusters */}
                  {activeCorridors.map((corridor) =>
                    corridor.nodes.map((node, nIdx) => {
                      const gradId =
                        node.intensity > 0.88
                          ? "url(#heatNodeCritical)"
                          : node.intensity > 0.7
                          ? "url(#heatNodeHigh)"
                          : "url(#heatNodeMedium)";
                      return (
                        <circle
                          key={`node-${corridor.id}-${nIdx}`}
                          cx={node.x}
                          cy={node.y}
                          r={node.radius * (selectedCorridorId === corridor.id ? 1.25 : 1.0)}
                          fill={gradId}
                          filter="url(#heatBlurFilter)"
                          className="transition-all duration-300 pointer-events-none"
                        />
                      );
                    })
                  )}

                  {/* 3. Dynamic Live Telemetry Points Layer into Heatmap */}
                  {telemetryHistory.slice(-20).map((pt, idx) => {
                    const x = 330 + ((idx * 17) % 210);
                    const y = 220 + ((idx * 11) % 55);
                    return (
                      <circle
                        key={`live-ping-${idx}`}
                        cx={x}
                        cy={y}
                        r="12"
                        fill="url(#heatNodeHigh)"
                        filter="url(#heatBlurFilter)"
                        opacity="0.6"
                        className="pointer-events-none"
                      />
                    );
                  })}

                  {/* 4. Interactive Corridor Hotspot Markers */}
                  {activeCorridors.map((corridor, idx) => {
                    const isSelected = selectedCorridorId === corridor.id;
                    const { x, y } = corridor.hotspotCoord;
                    return (
                      <g
                        key={`hotspot-tag-${corridor.id}`}
                        className="cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setSelectedCorridorId(isSelected ? null : corridor.id)}
                      >
                        {/* Outer Pulse */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? "18" : "12"}
                          fill={corridor.densityLevel === "CRITICAL_PEAK" ? "#EF4444" : "#F59E0B"}
                          fillOpacity="0.25"
                          className="animate-ping"
                        />

                        {/* Core Indicator */}
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill={corridor.densityLevel === "CRITICAL_PEAK" ? "#EF4444" : "#F59E0B"}
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />

                        {/* Hotspot Floating Badge */}
                        <rect
                          x={x - 42}
                          y={y - 26}
                          width="84"
                          height="17"
                          rx="4"
                          fill="#0F172A"
                          fillOpacity="0.92"
                          stroke={isSelected ? "#F59E0B" : "#475569"}
                          strokeWidth={isSelected ? "1.5" : "1"}
                        />
                        <text
                          x={x}
                          y={y - 14}
                          fill={corridor.densityLevel === "CRITICAL_PEAK" ? "#FCA5A5" : "#FDE68A"}
                          fontSize="8.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          🔥 {corridor.pingCount} PINGS
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Traverse Corridor Route Track Line (Standard Grid) */}
              {activeProjection === "ANTARCTICA" && !showHeatmap && (
                <path
                  d="M330 220 Q425 245 520 270"
                  fill="none"
                  stroke="url(#routeTrackGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                />
              )}

              {/* Stations Markers */}
              {activeProjection === "ANTARCTICA" ? (
                <>
                  {/* Maitri Region (Schirmacher Oasis: ~X:330, Y:220) */}
                  <g id="marker-maitri" className="cursor-pointer" onClick={() => setSelectedAssetId("AST-PB-01")}>
                    <circle cx="330" cy="220" r="10" fill="#0284C7" fillOpacity="0.3" className="animate-ping" />
                    <circle cx="330" cy="220" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
                    <text x="345" y="218" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      MAITRI STATION (70°45′S)
                    </text>
                  </g>

                  {/* Bharati Region (Larsemann Hills: ~X:520, Y:270) */}
                  <g id="marker-bharati" className="cursor-pointer" onClick={() => setSelectedAssetId("AST-SNOWMOBILE-02")}>
                    <circle cx="520" cy="270" r="10" fill="#10B981" fillOpacity="0.3" className="animate-ping" />
                    <circle cx="520" cy="270" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                    <text x="535" y="268" fill="#10B981" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      BHARATI STATION (69°24′S)
                    </text>
                  </g>
                </>
              ) : (
                <g id="marker-himadri">
                  <circle cx="410" cy="250" r="8" fill="#38BDF8" className="animate-ping" />
                  <circle cx="410" cy="250" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="425" y="248" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    HIMADRI STATION (78°55′N)
                  </text>
                </g>
              )}

              {/* Dynamic Live Asset Icons with Interactive SVG Pins */}
              {assets.map((asset) => {
                // Map real coordinates to canvas X/Y
                let x = 400;
                let y = 300;
                if (asset.id === "AST-VESSEL-01") {
                  x = 560 + (Math.sin(playbackIndex) * 10);
                  y = 230 + (Math.cos(playbackIndex) * 8);
                } else if (asset.id === "AST-PB-01") {
                  x = 360 + (playbackIndex * 2);
                  y = 228 + (Math.sin(playbackIndex / 2) * 4);
                } else if (asset.id === "AST-AWS-01") {
                  x = 310;
                  y = 250;
                } else if (asset.id === "AST-SNOWMOBILE-02") {
                  x = 490 - (playbackIndex * 1.5);
                  y = 265 + (Math.cos(playbackIndex) * 5);
                } else if (asset.id === "AST-HIMADRI-UAV") {
                  x = 420;
                  y = 240;
                }

                const isSelected = asset.id === selectedAssetId;
                const isAlert = asset.status === "ALERT";

                return (
                  <g
                    key={asset.id}
                    id={`asset-marker-${asset.id}`}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => {
                      setSelectedAssetId(asset.id);
                      onSelectAsset(asset);
                    }}
                  >
                    {/* Ring highlight when active */}
                    {isSelected && (
                      <circle cx={x} cy={y} r="18" fill="none" stroke="#38BDF8" strokeWidth="2" className="animate-pulse" />
                    )}

                    {/* Sensor alert ring */}
                    {isAlert && (
                      <circle cx={x} cy={y} r="22" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" className="animate-ping" />
                    )}

                    {/* Marker Pin */}
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill={isAlert ? "#EF4444" : isSelected ? "#0284C7" : "#0EA5E9"}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />

                    {/* Label Tag */}
                    <rect
                      x={x - 45}
                      y={y - 28}
                      width="90"
                      height="16"
                      rx="4"
                      fill="#0F172A"
                      fillOpacity="0.85"
                      stroke={isSelected ? "#38BDF8" : "#334155"}
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={y - 17}
                      fill="#F8FAFC"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="system-ui"
                    >
                      {asset.code.split("-")[0] + " " + (asset.code.split("-")[1] || "")}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* In-Map Heatmap Legend Overlay (Top Left) */}
            {showHeatmap && (
              <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-300 space-y-1.5 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 font-mono">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>TRAFFIC DENSITY HEATMAP</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-mono">
                    HISTORICAL
                  </span>
                </div>

                {/* Gradient Ramp */}
                <div className="space-y-0.5">
                  <div className="h-2 w-36 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-600 shadow-inner"></div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>Low (≤500)</span>
                    <span>Med</span>
                    <span className="text-rose-400 font-bold">Peak (≥5k pings)</span>
                  </div>
                </div>

                {/* Intensity Slider in HUD */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                  <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono">
                    <Sliders className="w-2.5 h-2.5 text-slate-500" />
                    Intensity:
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="range"
                      min="0.3"
                      max="1.0"
                      step="0.05"
                      value={heatmapIntensity}
                      onChange={(e) => setHeatmapIntensity(Number(e.target.value))}
                      className="w-16 accent-amber-500 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
                    />
                    <span className="font-mono text-[9px] text-slate-300 w-6 text-right">
                      {Math.round(heatmapIntensity * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* In-Map Telemetry & Corridor HUD Overlay (Bottom Left) */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1 font-mono">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <Radio className="w-3.5 h-3.5 animate-spin" />
                <span>IRIDIUM SBD LIVE INGESTION</span>
              </div>
              <div>Buffer: {telemetryHistory.length} frames | Total Pings: {totalRegionalPings.toLocaleString()}</div>
              <div>
                Traffic Corridors:{" "}
                <strong className="text-amber-400">{activeCorridors.length} Monitored Arteries</strong>
              </div>
              <div>Geofence Status: {isInsideAspaAlert ? "⚠️ NEAR ASPA-136" : "✅ NORMAL"}</div>
            </div>

            {/* Selected Corridor Floating Inspector Badge (Top Right) */}
            {selectedCorridor && (
              <div className="absolute top-3 right-3 max-w-xs bg-slate-950/95 backdrop-blur-md p-3 rounded-xl border border-amber-500/50 text-xs text-slate-200 shadow-2xl space-y-2 animate-in fade-in zoom-in duration-200">
                <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-white leading-tight">{selectedCorridor.name}</h4>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">
                        {selectedCorridor.densityLevel.replace("_", " ")} ({selectedCorridor.pingCount.toLocaleString()} PINGS)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCorridorId(null)}
                    className="p-1 text-slate-400 hover:text-white rounded bg-slate-900 hover:bg-slate-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedCorridor.description}
                </p>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">DOMINANT ASSET:</span>
                    <span className="text-slate-200 font-bold truncate block">{selectedCorridor.dominantAssetClass}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">AVG SPEED:</span>
                    <span className="text-emerald-400 font-bold">{selectedCorridor.avgTraverseSpeedKmH} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">HAZARD RATING:</span>
                    <span
                      className={`font-bold ${
                        selectedCorridor.hazardRating === "HIGH_CREVASSE"
                          ? "text-rose-400"
                          : selectedCorridor.hazardRating === "ICE_DRIFT"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {selectedCorridor.hazardRating.replace("_", " ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">CLUSTER NODES:</span>
                    <span className="text-sky-400 font-bold">{selectedCorridor.nodes.length} GPS Hubs</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Telemetry Playback Scrubber */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                id="btn-playback-toggle"
                onClick={() => setIsPlayingPlayback(!isPlayingPlayback)}
                className="p-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition shadow-xs"
                title={isPlayingPlayback ? "Pause playback" : "Play telemetry time series"}
              >
                {isPlayingPlayback ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                id="btn-playback-reset"
                onClick={() => {
                  setIsPlayingPlayback(false);
                  setPlaybackIndex(0);
                }}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition"
                title="Reset to start of buffer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <span className="text-slate-400 font-mono text-[11px]">
                Frame {playbackIndex + 1}/{telemetryHistory.length || 1}
              </span>
            </div>

            {/* Slider */}
            <div className="flex-1 w-full max-w-md flex items-center gap-2">
              <input
                id="telemetry-playback-slider"
                type="range"
                min="0"
                max={Math.max(0, telemetryHistory.length - 1)}
                value={playbackIndex}
                onChange={(e) => {
                  setIsPlayingPlayback(false);
                  setPlaybackIndex(Number(e.target.value));
                }}
                className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
            </div>

            <div className="text-slate-400 text-[11px] font-mono whitespace-nowrap">
              {currentPlaybackPoint?.timestamp ? new Date(currentPlaybackPoint.timestamp).toLocaleTimeString() : "--:--:--"}
            </div>
          </div>
        </div>

        {/* Telemetry Inspector Card for Selected Asset or Corridor */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            {/* Top Inspector Header with Active Corridor Quick Summary */}
            {activeAsset ? (
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {activeAsset.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{activeAsset.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{activeAsset.code}</p>
                  </div>

                  <div
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      activeAsset.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : activeAsset.status === "ALERT"
                        ? "bg-red-100 text-red-800 animate-pulse"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {activeAsset.status}
                  </div>
                </div>

                {/* Real-time Telemetry Metrics List */}
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Coordinates</span>
                      <div className="font-mono font-bold text-slate-800 text-[11px] mt-0.5">
                        {activeAsset.latitude.toFixed(4)}°, {activeAsset.longitude.toFixed(4)}°
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Sensor Temp</span>
                      <div className="font-mono font-bold text-slate-800 text-[11px] mt-0.5 flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-sky-600" />
                        {activeAsset.temperatureC.toFixed(1)}°C
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Battery Reserve</span>
                      <div className="font-mono font-bold text-emerald-700 text-[11px] mt-0.5 flex items-center gap-1">
                        <BatteryCharging className="w-3.5 h-3.5" />
                        {activeAsset.batteryPct}%
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Shock Sensor</span>
                      <div
                        className={`font-mono font-bold text-[11px] mt-0.5 flex items-center gap-1 ${
                          activeAsset.shockG > 1.5 ? "text-red-600" : "text-slate-800"
                        }`}
                      >
                        <Activity className="w-3.5 h-3.5 text-amber-500" />
                        {activeAsset.shockG.toFixed(2)} G
                      </div>
                    </div>
                  </div>

                  {/* Chain of Custody Box */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      Chain of Custody & RFID
                    </div>
                    <div className="font-semibold text-slate-800">
                      Custodian: {activeAsset.chainOfCustody?.currentHolder || "Station Pool"}
                    </div>
                    <div className="font-mono text-[11px] text-slate-600">
                      Tag: {activeAsset.chainOfCustody?.rfidTag || "N/A"}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Last verified: {activeAsset.chainOfCustody?.lastVerifiedAt ? new Date(activeAsset.chainOfCustody.lastVerifiedAt).toLocaleString() : "Pending"}
                    </div>
                  </div>

                  {/* High-Traffic Polar Corridors List */}
                  <div className="p-3 bg-gradient-to-br from-amber-500/10 via-slate-50 to-sky-500/10 rounded-xl border border-amber-200/80 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950">
                        <Flame className="w-4 h-4 text-amber-600" />
                        <span>High-Traffic Polar Corridors</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        {activeCorridors.length} Active
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {activeCorridors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCorridorId(c.id === selectedCorridorId ? null : c.id)}
                          className={`w-full text-left p-2 rounded-lg border text-xs transition flex items-center justify-between gap-2 ${
                            selectedCorridorId === c.id
                              ? "bg-amber-100/90 border-amber-400 text-amber-950 font-semibold shadow-xs"
                              : "bg-white/80 border-slate-200 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="font-bold truncate block text-[11px]">{c.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {c.dominantAssetClass.split("&")[0]}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              c.densityLevel === "CRITICAL_PEAK"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {c.pingCount} pings
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 my-auto">
                <Navigation className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
                <p className="text-xs font-semibold text-slate-600">No telemetry asset selected</p>
                <p className="text-[11px] text-slate-400 mt-1">Select an active vehicle or station from the fleet list below</p>
              </div>
            )}
          </div>

          {/* Quick Selection Carousel */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Active Fleet ({assets.length})
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {assets.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAssetId(a.id)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition border ${
                    a.id === selectedAssetId
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {a.name.slice(0, 16)}...
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
