import React, { useState, useEffect } from "react";
import { Asset, TelemetryPoint, WeatherData, Language, Expedition } from "../types";
import { 
  Compass, 
  Layers, 
  Eye, 
  Wind, 
  Thermometer, 
  Radio, 
  AlertTriangle, 
  Activity, 
  Users, 
  Fuel, 
  Boxes, 
  HeartPulse, 
  Zap, 
  Calendar, 
  ShieldAlert, 
  Maximize2,
  Navigation,
  Crosshair,
  Sparkles,
  Search,
  ExternalLink,
  RotateCw
} from "lucide-react";

interface PolarDigitalTwinProps {
  assets?: Asset[];
  telemetryHistory?: TelemetryPoint[];
  liveWeather?: WeatherData | null;
  currentStation: string;
  onSelectStation?: (st: string) => void;
  onOpenCargoPassport: (cargoId: string) => void;
  onTriggerSos?: (payload?: any) => void;
  onOpenCopilot?: () => void;
  onOpenSimulator?: () => void;
}

interface DigitalTwinEntity {
  id: string;
  type: "STATION" | "VESSEL" | "VEHICLE_CONVOY" | "PERSONNEL_GROUP" | "WEATHER_ZONE" | "EMERGENCY_ZONE" | "EQUIPMENT";
  name: string;
  code: string;
  region: "ANTARCTICA" | "ARCTIC";
  coordinates: { x: number; y: number; lat: number; lon: number };
  personnelCount: number;
  fuelPct: number;
  foodPct: number;
  medicalPct: number;
  powerPct: number;
  weatherState: "Severe" | "Blizzard" | "Nominal" | "Fair";
  temperatureC: number;
  windSpeedKmh: number;
  nextResupplyDays: number;
  operationalHealthScore: number;
  operationalState: "STABLE" | "ATTENTION" | "HIGH_RISK" | "CRITICAL";
  details: string;
  activeCargoIds?: string[];
}

export const PolarDigitalTwin: React.FC<PolarDigitalTwinProps> = ({
  assets,
  telemetryHistory,
  liveWeather,
  currentStation,
  onSelectStation,
  onOpenCargoPassport,
  onTriggerSos,
}) => {
  const [viewMode, setViewMode] = useState<"2D_RADAR" | "3D_ISOMETRIC" | "THERMAL_IR">("2D_RADAR");
  const [projection, setProjection] = useState<"ANTARCTICA" | "ARCTIC">(
    currentStation === "HIMADRI" ? "ARCTIC" : "ANTARCTICA"
  );
  const [selectedEntityId, setSelectedEntityId] = useState<string>("STAT-MAITRI");
  const [layerFilters, setLayerFilters] = useState({
    stations: true,
    vessels: true,
    routes: true,
    weatherZones: true,
    emergencyZones: true,
    personnel: true,
  });
  const [radarRotation, setRadarRotation] = useState(0);

  // Auto rotate radar sweep in 2D mode
  useEffect(() => {
    const timer = setInterval(() => {
      setRadarRotation((prev) => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentStation === "HIMADRI") {
      setProjection("ARCTIC");
      setSelectedEntityId("STAT-HIMADRI");
    } else if (currentStation === "BHARATI") {
      setProjection("ANTARCTICA");
      setSelectedEntityId("STAT-BHARATI");
    } else {
      setProjection("ANTARCTICA");
      setSelectedEntityId("STAT-MAITRI");
    }
  }, [currentStation]);

  // Digital Twin Polar Entities
  const entities: DigitalTwinEntity[] = [
    {
      id: "STAT-MAITRI",
      type: "STATION",
      name: "Maitri Research Station",
      code: "IND-MAITRI-01",
      region: "ANTARCTICA",
      coordinates: { x: 330, y: 220, lat: -70.766, lon: 11.735 },
      personnelCount: 42,
      fuelPct: 68,
      foodPct: 74,
      medicalPct: 51,
      powerPct: 91,
      weatherState: "Severe",
      temperatureC: -26.4,
      windSpeedKmh: 48,
      nextResupplyDays: 8,
      operationalHealthScore: 68,
      operationalState: "HIGH_RISK",
      details: "Schirmacher Oasis inland ice shelf station. Fuel buffer is in high burn due to katabatic wind storm. Next resupply window scheduled in 8 days.",
      activeCargoIds: ["POLAR-CN-104", "POLAR-FUEL-902"],
    },
    {
      id: "STAT-BHARATI",
      type: "STATION",
      name: "Bharati Research Station",
      code: "IND-BHARATI-02",
      region: "ANTARCTICA",
      coordinates: { x: 530, y: 280, lat: -69.407, lon: 76.187 },
      personnelCount: 28,
      fuelPct: 52,
      foodPct: 81,
      medicalPct: 62,
      powerPct: 96,
      weatherState: "Severe",
      temperatureC: -19.2,
      windSpeedKmh: 54,
      nextResupplyDays: 11,
      operationalHealthScore: 64,
      operationalState: "HIGH_RISK",
      details: "Larsemann Hills coastal station. MV Vasiliy Golovnin approaching fast-ice edge through 88% sea-ice pack. Medical trauma kit inventory flagged for replenishment.",
      activeCargoIds: ["POLAR-MED-208"],
    },
    {
      id: "STAT-HIMADRI",
      type: "STATION",
      name: "Himadri Research Station",
      code: "IND-HIMADRI-03",
      region: "ARCTIC",
      coordinates: { x: 420, y: 260, lat: 78.923, lon: 11.933 },
      personnelCount: 18,
      fuelPct: 84,
      foodPct: 88,
      medicalPct: 79,
      powerPct: 98,
      weatherState: "Fair",
      temperatureC: -8.5,
      windSpeedKmh: 14,
      nextResupplyDays: 24,
      operationalHealthScore: 89,
      operationalState: "STABLE",
      details: "Ny-Ålesund, Svalbard Arctic fjord laboratory. Marine sampling and cryo-atmospheric sensors operating nominally.",
      activeCargoIds: ["POLAR-GEO-331"],
    },
    {
      id: "VESSEL-VASILIY",
      type: "VESSEL",
      name: "Chartered Polar Vessel MV Vasiliy Golovnin",
      code: "AST-VESSEL-01",
      region: "ANTARCTICA",
      coordinates: { x: 580, y: 210, lat: -69.21, lon: 76.05 },
      personnelCount: 54,
      fuelPct: 87,
      foodPct: 92,
      medicalPct: 95,
      powerPct: 99,
      weatherState: "Severe",
      temperatureC: -18.4,
      windSpeedKmh: 52,
      nextResupplyDays: 2,
      operationalHealthScore: 72,
      operationalState: "ATTENTION",
      details: "Heavy ice-class cargo vessel navigating Prydz Bay pack-ice at 8.2 knots. Loaded with 40,000L fuel, scientific drill modules, and wintering supplies.",
      activeCargoIds: ["POLAR-CN-104", "POLAR-FUEL-902"],
    },
    {
      id: "CONVOY-PISTENBULLY",
      type: "VEHICLE_CONVOY",
      name: "PistenBully 300P Heavy Traverse Convoy (Unit A)",
      code: "AST-PB-01",
      region: "ANTARCTICA",
      coordinates: { x: 380, y: 260, lat: -70.82, lon: 11.95 },
      personnelCount: 4,
      fuelPct: 62,
      foodPct: 75,
      medicalPct: 70,
      powerPct: 84,
      weatherState: "Blizzard",
      temperatureC: -28.6,
      windSpeedKmh: 42,
      nextResupplyDays: 4,
      operationalHealthScore: 66,
      operationalState: "HIGH_RISK",
      details: "Heavy snowcat towing survival sledges across Schirmacher inland plateau. Ground-penetrating radar active to detect hidden crevasse snow bridges.",
      activeCargoIds: ["POLAR-MED-208"],
    },
    {
      id: "PERS-TRAVERSE-BETA",
      type: "PERSONNEL_GROUP",
      name: "Traverse Field Team Beta (6 Crew)",
      code: "PERS-GRP-BETA",
      region: "ANTARCTICA",
      coordinates: { x: 440, y: 310, lat: -70.45, lon: 32.10 },
      personnelCount: 6,
      fuelPct: 58,
      foodPct: 69,
      medicalPct: 65,
      powerPct: 88,
      weatherState: "Severe",
      temperatureC: -31.2,
      windSpeedKmh: 38,
      nextResupplyDays: 6,
      operationalHealthScore: 70,
      operationalState: "ATTENTION",
      details: "Scientific expedition team conducting glaciological coring. Satellite radio check-in completed every 60 minutes.",
    },
    {
      id: "EMERGENCY-SOS-WOHLTHAT",
      type: "EMERGENCY_ZONE",
      name: "Crevasse Fall Incident Zone (Wohlthat Spur)",
      code: "INC-2026-081",
      region: "ANTARCTICA",
      coordinates: { x: 355, y: 285, lat: -70.84, lon: 12.05 },
      personnelCount: 2,
      fuelPct: 40,
      foodPct: 60,
      medicalPct: 45,
      powerPct: 76,
      weatherState: "Severe",
      temperatureC: -29.8,
      windSpeedKmh: 45,
      nextResupplyDays: 1,
      operationalHealthScore: 42,
      operationalState: "CRITICAL",
      details: "ACTIVE SOS DISTRESS BEACON. Sledge runner settled in 4m crevasse lip. Winch anchor secured. Station rescue snowmobile dispatched.",
    },
    {
      id: "WEATHER-VORTEX-PRYDZ",
      type: "WEATHER_ZONE",
      name: "Katabatic Blizzard Storm Front",
      code: "WX-ZONE-01",
      region: "ANTARCTICA",
      coordinates: { x: 550, y: 240, lat: -69.0, lon: 74.0 },
      personnelCount: 0,
      fuelPct: 0,
      foodPct: 0,
      medicalPct: 0,
      powerPct: 0,
      weatherState: "Severe",
      temperatureC: -34.5,
      windSpeedKmh: 68,
      nextResupplyDays: 0,
      operationalHealthScore: 35,
      operationalState: "CRITICAL",
      details: "High-velocity katabatic gale vortex. Visibility 400m in blowing snow. Air operations halted.",
    },
  ];

  const visibleEntities = entities.filter((e) => {
    if (e.region !== projection) return false;
    if (e.type === "STATION" && !layerFilters.stations) return false;
    if (e.type === "VESSEL" && !layerFilters.vessels) return false;
    if (e.type === "WEATHER_ZONE" && !layerFilters.weatherZones) return false;
    if (e.type === "EMERGENCY_ZONE" && !layerFilters.emergencyZones) return false;
    if (e.type === "PERSONNEL_GROUP" && !layerFilters.personnel) return false;
    return true;
  });

  const selectedEntity = entities.find((e) => e.id === selectedEntityId) || entities[0];

  return (
    <div className="space-y-3.5">
      {/* Top Digital Twin Control Bar */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wider uppercase text-white font-mono flex items-center gap-1.5">
                Polar Expedition Digital Twin
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/30">
                  REAL-TIME SYNC
                </span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Live bi-directional digital telemetry replica: Stations, Vessels, Cargo Convoys & Weather Hazards
            </p>
          </div>
        </div>

        {/* Mode Selector (2D Radar, 3D Isometric, Thermal IR) & Projection */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Region */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => { setProjection("ANTARCTICA"); setSelectedEntityId("STAT-MAITRI"); }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                projection === "ANTARCTICA" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              Antarctica
            </button>
            <button
              onClick={() => { setProjection("ARCTIC"); setSelectedEntityId("STAT-HIMADRI"); }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                projection === "ARCTIC" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              Arctic (Himadri)
            </button>
          </div>

          {/* Visualization Modes */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode("2D_RADAR")}
              className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                viewMode === "2D_RADAR" ? "bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              <Crosshair className="w-3 h-3" />
              2D Radar Grid
            </button>
            <button
              onClick={() => setViewMode("3D_ISOMETRIC")}
              className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                viewMode === "3D_ISOMETRIC" ? "bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3 h-3" />
              3D Digital Twin
            </button>
            <button
              onClick={() => setViewMode("THERMAL_IR")}
              className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                viewMode === "THERMAL_IR" ? "bg-amber-950/80 text-amber-300 font-bold border border-amber-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3 h-3" />
              Thermal Infrared
            </button>
          </div>
        </div>
      </div>

      {/* Main Digital Twin Grid: Full-Width Tactical Canvas + Interactive Live Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* The Digital Twin Canvas */}
        <div className="lg:col-span-8 bg-[#030712] border border-slate-800 rounded-xl p-3 flex flex-col relative overflow-hidden shadow-2xl min-h-[520px]">
          {/* Top Canvas HUD Toolbar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-white font-bold tracking-wider">
                {projection === "ANTARCTICA"
                  ? "SOUTH POLAR GRID (68°S – 90°S STEREOGRAPHIC TWIN)"
                  : "ARCTIC SVALBARD BASIN (78°N – 82°N TWIN)"}
              </span>
            </div>

            {/* Layer Toggles */}
            <div className="hidden sm:flex items-center gap-2 text-[10px]">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerFilters.stations}
                  onChange={(e) => setLayerFilters({ ...layerFilters, stations: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500"
                />
                <span>Stations</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerFilters.vessels}
                  onChange={(e) => setLayerFilters({ ...layerFilters, vessels: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500"
                />
                <span>Vessels</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerFilters.routes}
                  onChange={(e) => setLayerFilters({ ...layerFilters, routes: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500"
                />
                <span>Corridors</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerFilters.weatherZones}
                  onChange={(e) => setLayerFilters({ ...layerFilters, weatherZones: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500"
                />
                <span>Weather Fronts</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layerFilters.emergencyZones}
                  onChange={(e) => setLayerFilters({ ...layerFilters, emergencyZones: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500"
                />
                <span>SOS Zones</span>
              </label>
            </div>
          </div>

          {/* Interactive SVG Polar Twin Stage */}
          <div className="relative flex-1 w-full h-[470px] my-1 flex items-center justify-center select-none overflow-hidden rounded-lg bg-radial from-[#071326] via-[#040a14] to-[#02050b]">
            <svg
              viewBox="0 0 800 560"
              className={`w-full h-full object-contain ${
                viewMode === "3D_ISOMETRIC" ? "scale-95 [transform:perspective(800px)_rotateX(20deg)]" : ""
              } ${viewMode === "THERMAL_IR" ? "contrast-150 saturate-200 hue-rotate-180" : ""}`}
            >
              <defs>
                <radialGradient id="radarGridGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0B1C38" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#061224" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#02060D" stopOpacity="0.9" />
                </radialGradient>
                <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Radar Coordinate Range Rings */}
              <circle cx="400" cy="280" r="260" fill="url(#radarGridGrad)" stroke="#1E293B" strokeWidth="1.5" />
              <circle cx="400" cy="280" r="195" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="400" cy="280" r="130" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="400" cy="280" r="65" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 2" />

              {/* Crosshair Cardinal Guides */}
              <line x1="400" y1="20" x2="400" y2="540" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="140" y1="280" x2="660" y2="280" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />

              {/* Rotating Radar Sweep Cone (2D Mode) */}
              {viewMode === "2D_RADAR" && (
                <g transform={`rotate(${radarRotation} 400 280)`}>
                  <path
                    d="M400 280 L660 280 A260 260 0 0 0 630 150 Z"
                    fill="#06b6d4"
                    fillOpacity="0.06"
                  />
                  <line x1="400" y1="280" x2="660" y2="280" stroke="#22D3EE" strokeWidth="1" opacity="0.4" />
                </g>
              )}

              {/* Geographic Coastline / Ice-Shelf Geometry */}
              {projection === "ANTARCTICA" ? (
                <g id="antarctica-geometry">
                  {/* Continental Ice Shelf Silhouette */}
                  <path
                    d="M 230,170 C 310,130 490,120 590,180 C 670,240 680,380 600,460 C 510,540 280,530 200,430 C 130,340 160,220 230,170 Z"
                    fill="#0A1526"
                    stroke="#1E3A5F"
                    strokeWidth="2"
                    opacity="0.85"
                  />
                  {/* High Polar Plateau (Inland) */}
                  <path
                    d="M 310,210 C 380,180 470,180 520,230 C 560,280 550,360 500,410 C 440,450 350,440 310,390 C 270,340 270,250 310,210 Z"
                    fill="#07101E"
                    stroke="#234E70"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />

                  {/* Supply Traversal Corridors */}
                  {layerFilters.routes && (
                    <g id="traverse-corridors">
                      {/* Maitri to Bharati Inland Traverse Corridor */}
                      <path
                        d="M 330,220 Q 420,240 530,280"
                        fill="none"
                        stroke="url(#corridorGrad)"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                        filter="url(#glow)"
                      />
                      {/* Prydz Bay Sea Lane approach to Bharati */}
                      <path
                        d="M 640,160 Q 600,200 530,280"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="2"
                        strokeDasharray="5 3"
                        opacity="0.6"
                      />
                    </g>
                  )}

                  {/* Weather Storm Zone Polygon */}
                  {layerFilters.weatherZones && (
                    <g id="weather-front-prydz">
                      <circle cx="550" cy="240" r="45" fill="#EF4444" fillOpacity="0.12" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
                      <text x="505" y="244" fill="#F87171" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        KATABATIC GALE 54 km/h
                      </text>
                    </g>
                  )}

                  {/* Emergency SOS Crevasse Zone */}
                  {layerFilters.emergencyZones && (
                    <g id="sos-zone-wohlthat" className="cursor-pointer" onClick={() => setSelectedEntityId("EMERGENCY-SOS-WOHLTHAT")}>
                      <circle cx="355" cy="285" r="22" fill="#DC2626" fillOpacity="0.25" className="animate-ping" />
                      <circle cx="355" cy="285" r="9" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                      <text x="370" y="289" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="monospace">
                        SOS CREVASSE SITE
                      </text>
                    </g>
                  )}
                </g>
              ) : (
                <g id="arctic-geometry">
                  {/* Svalbard / Spitsbergen Archipelago Outline */}
                  <path
                    d="M 360,200 C 440,170 480,220 460,320 C 430,400 370,390 350,330 C 330,270 320,220 360,200 Z"
                    fill="#0A1526"
                    stroke="#1E3A5F"
                    strokeWidth="2"
                  />
                  {/* Kongsfjorden Arctic Route */}
                  <path
                    d="M 380,380 Q 400,320 420,260"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />
                </g>
              )}

              {/* Render Visible Digital Twin Entities */}
              {visibleEntities.map((entity) => {
                const isSelected = entity.id === selectedEntityId;
                const { x, y } = entity.coordinates;

                if (entity.type === "STATION") {
                  return (
                    <g
                      key={entity.id}
                      className="cursor-pointer transition-transform duration-200"
                      onClick={() => {
                        setSelectedEntityId(entity.id);
                        if (entity.id === "STAT-MAITRI") onSelectStation?.("MAITRI");
                        if (entity.id === "STAT-BHARATI") onSelectStation?.("BHARATI");
                        if (entity.id === "STAT-HIMADRI") onSelectStation?.("HIMADRI");
                      }}
                    >
                      {/* Pulse ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 18 : 12}
                        fill={entity.operationalState === "CRITICAL" ? "#EF4444" : "#06B6D4"}
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                      {/* Outer selection ring */}
                      {isSelected && (
                        <circle cx={x} cy={y} r={14} fill="none" stroke="#22D3EE" strokeWidth="2" strokeDasharray="3 2" />
                      )}
                      {/* Station Core Marker */}
                      <rect
                        x={x - 6}
                        y={y - 6}
                        width="12"
                        height="12"
                        fill="#0284C7"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        rx="2"
                      />
                      <text
                        x={x + 12}
                        y={y + 4}
                        fill="#E0F2FE"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                        filter="url(#glow)"
                      >
                        {entity.name.split(" ")[0].toUpperCase()} ({entity.fuelPct}% FUEL)
                      </text>
                      <text
                        x={x + 12}
                        y={y + 16}
                        fill={entity.operationalState === "CRITICAL" ? "#F87171" : entity.operationalState === "HIGH_RISK" ? "#FBBF24" : "#34D399"}
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        ● {entity.operationalState} | Crew: {entity.personnelCount}
                      </text>
                    </g>
                  );
                }

                if (entity.type === "VESSEL") {
                  return (
                    <g
                      key={entity.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedEntityId(entity.id)}
                    >
                      <circle cx={x} cy={y} r={isSelected ? 16 : 10} fill="#38BDF8" fillOpacity="0.2" className="animate-pulse" />
                      {isSelected && <circle cx={x} cy={y} r={14} fill="none" stroke="#38BDF8" strokeWidth="1.5" />}
                      <polygon
                        points={`${x},${y - 8} ${x + 6},${y + 6} ${x - 6},${y + 6}`}
                        fill="#0284C7"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      <text x={x + 10} y={y - 2} fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                        MV VASILIY (8.2 kt)
                      </text>
                    </g>
                  );
                }

                if (entity.type === "VEHICLE_CONVOY") {
                  return (
                    <g
                      key={entity.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedEntityId(entity.id)}
                    >
                      <circle cx={x} cy={y} r={isSelected ? 14 : 9} fill="#F59E0B" fillOpacity="0.25" />
                      <rect x={x - 5} y={y - 5} width="10" height="10" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.2" rx="2" />
                      <text x={x + 8} y={y + 3} fill="#FCD34D" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        PISTENBULLY-A (18 km/h)
                      </text>
                    </g>
                  );
                }

                if (entity.type === "PERSONNEL_GROUP") {
                  return (
                    <g
                      key={entity.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedEntityId(entity.id)}
                    >
                      <circle cx={x} cy={y} r={8} fill="#10B981" fillOpacity="0.4" />
                      <circle cx={x} cy={y} r={4} fill="#34D399" stroke="#FFFFFF" strokeWidth="1" />
                      <text x={x + 8} y={y + 3} fill="#6EE7B7" fontSize="9" fontFamily="monospace">
                        FIELD TEAM BETA (6)
                      </text>
                    </g>
                  );
                }

                return null;
              })}
            </svg>

            {/* Bottom-left Coordinates HUD Display */}
            <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1.5 rounded text-[11px] font-mono text-slate-400 space-y-0.5">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Radio className="w-3 h-3 animate-ping" />
                <span>IRIDIUM SBD CONSTELLATION: LINKED</span>
              </div>
              <div className="text-[10px] text-slate-500">
                Projection: Stereographic Polar | Lat: -70.76° | Lon: 11.73° | Elevation: 240m
              </div>
            </div>

            {/* Bottom-right Legend HUD */}
            <div className="absolute bottom-2.5 right-2.5 hidden md:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Station
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> Vessel
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Convoy
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Emergency SOS
              </span>
            </div>
          </div>
        </div>

        {/* Live Information Panel for Selected Entity */}
        <div className="lg:col-span-4 bg-[#0b1220] border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl text-slate-200">
          <div className="space-y-4">
            {/* Header: Name, Code, Health State Badge */}
            <div className="border-b border-slate-800/80 pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {selectedEntity.type}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    selectedEntity.operationalState === "CRITICAL"
                      ? "bg-red-950/60 text-red-400 border-red-500/50"
                      : selectedEntity.operationalState === "HIGH_RISK"
                      ? "bg-orange-950/60 text-orange-400 border-orange-500/50"
                      : selectedEntity.operationalState === "ATTENTION"
                      ? "bg-amber-950/60 text-amber-400 border-amber-500/50"
                      : "bg-emerald-950/60 text-emerald-400 border-emerald-500/50"
                  }`}
                >
                  ● {selectedEntity.operationalState} ({selectedEntity.operationalHealthScore}/100)
                </span>
              </div>
              <h3 className="text-lg font-black text-white tracking-tight mt-1">
                {selectedEntity.name}
              </h3>
              <p className="text-xs font-mono text-cyan-400/90 mt-0.5">
                {selectedEntity.code} | Lat: {selectedEntity.coordinates.lat}° Lon: {selectedEntity.coordinates.lon}°
              </p>
            </div>

            {/* Vital Operational Metrics (Personnel, Fuel, Food, Medical, Power, Weather, Resupply) */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Real-Time Vital Telemetry:
              </div>

              {/* Grid of Key Readouts */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {/* Personnel */}
                <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-cyan-400" /> Crew Headcount
                    </span>
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {selectedEntity.personnelCount} Personnel
                  </div>
                </div>

                {/* Next Resupply */}
                <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" /> Next Resupply
                    </span>
                  </div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">
                    {selectedEntity.nextResupplyDays} Days Window
                  </div>
                </div>

                {/* Weather */}
                <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-slate-300" /> Atmospheric
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-200 mt-0.5">
                    {selectedEntity.temperatureC}°C | {selectedEntity.weatherState}
                  </div>
                </div>

                {/* Power */}
                <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400" /> Generator Power
                    </span>
                  </div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {selectedEntity.powerPct}% Grid Normal
                  </div>
                </div>
              </div>

              {/* Progress Bars: Fuel, Food, Medical */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 space-y-2 text-xs">
                {/* Fuel */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Fuel className="w-3.5 h-3.5 text-amber-400" /> Fuel Buffer
                    </span>
                    <span className={`font-bold ${selectedEntity.fuelPct < 60 ? "text-red-400" : "text-amber-400"}`}>
                      {selectedEntity.fuelPct}% Capacity
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        selectedEntity.fuelPct >= 70 ? "bg-emerald-500" :
                        selectedEntity.fuelPct >= 50 ? "bg-amber-400" : "bg-red-500"
                      }`}
                      style={{ width: `${selectedEntity.fuelPct}%` }}
                    />
                  </div>
                </div>

                {/* Food */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Boxes className="w-3.5 h-3.5 text-cyan-400" /> Food Rations
                    </span>
                    <span className="font-bold text-cyan-400 font-mono">
                      {selectedEntity.foodPct}% Stocked
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full bg-cyan-500"
                      style={{ width: `${selectedEntity.foodPct}%` }}
                    />
                  </div>
                </div>

                {/* Medical */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Medical Supplies
                    </span>
                    <span className={`font-bold ${selectedEntity.medicalPct < 60 ? "text-rose-400" : "text-emerald-400"}`}>
                      {selectedEntity.medicalPct}% Viable
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        selectedEntity.medicalPct >= 70 ? "bg-emerald-500" :
                        selectedEntity.medicalPct >= 50 ? "bg-amber-400" : "bg-rose-500"
                      }`}
                      style={{ width: `${selectedEntity.medicalPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Station / Entity Notes */}
              <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed font-sans">
                {selectedEntity.details}
              </div>

              {/* Associated Digital Cargo Passports */}
              {selectedEntity.activeCargoIds && selectedEntity.activeCargoIds.length > 0 && (
                <div className="pt-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Attached Cargo Passports:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEntity.activeCargoIds.map((cid) => (
                      <button
                        key={cid}
                        onClick={() => onOpenCargoPassport(cid)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono transition shadow-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{cid}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Commander Directive Actions */}
          <div className="pt-3 border-t border-slate-800 space-y-2 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenCargoPassport(selectedEntity.activeCargoIds?.[0] || "POLAR-CN-104")}
                className="w-full py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Boxes className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cargo Passport</span>
              </button>

              <button
                onClick={() => onTriggerSos?.({
                  station: selectedEntity.name,
                  description: `Commander Precautionary Distress Alert for ${selectedEntity.name}`,
                })}
                className="w-full py-2 px-2.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Station Alert</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
