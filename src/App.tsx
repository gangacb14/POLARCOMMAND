import React, { useState, useEffect } from "react";
import { 
  Expedition, 
  Asset, 
  TelemetryPoint, 
  InventoryItem, 
  Personnel, 
  Incident, 
  WeatherData, 
  Language,
  UserRole,
  AppTheme
} from "./types";
import { translations, I18nProvider, translate } from "./i18n";
import { Header } from "./components/Header";
import { MapTelemetryView } from "./components/MapTelemetryView";
import { PlannerView } from "./components/PlannerView";
import { AssetCargoView } from "./components/AssetCargoView";
import { InventoryView } from "./components/InventoryView";
import { PersonnelRosterView } from "./components/PersonnelRosterView";
import { IncidentSosView } from "./components/IncidentSosView";
import { MobileFieldPWAView } from "./components/MobileFieldPWAView";
import { SihDocsModal } from "./components/SihDocsModal";

// POLAR COMMAND Components
import { MissionHealthBar } from "./components/MissionHealthBar";
import { PolarDigitalTwin } from "./components/PolarDigitalTwin";
import { PolarAiCopilotView } from "./components/PolarAiCopilotView";
import { ExpeditionSimulatorView } from "./components/ExpeditionSimulatorView";
import { SmartResupplyView } from "./components/SmartResupplyView";
import { RouteIntelligenceView } from "./components/RouteIntelligenceView";
import { CargoPassportModal } from "./components/CargoPassportModal";
import { CommandNav, ParentModuleId, SubModuleId, CommandTab } from "./components/CommandNav";
import { SecondaryModulePanel, MODULE_CONFIGS } from "./components/SecondaryModulePanel";
import { MorningBriefModal } from "./components/MorningBriefModal";
import { PersonnelDigitalTwinView } from "./components/PersonnelDigitalTwinView";
import { EmergencyCommandView } from "./components/EmergencyCommandView";
import { ResourceDigitalTwinView } from "./components/ResourceDigitalTwinView";
import { WeatherImpactEngineView } from "./components/WeatherImpactEngineView";
import { ExpeditionTimelineView } from "./components/ExpeditionTimelineView";
import { MissionControlOverview } from "./components/MissionControlOverview";
import { ExpeditionReportModal } from "./components/ExpeditionReportModal";
import { StoryDemoPlayer } from "./components/StoryDemoPlayer";

// SIH 062 Enhanced Disaster & Multi-Hazard Components
import { DynamicDisasterDashboard } from "./components/DynamicDisasterDashboard";
import { Gis3dTerrainView } from "./components/Gis3dTerrainView";
import { CitizenIncidentModule } from "./components/CitizenIncidentModule";
import { AnalyticsWowHub } from "./components/AnalyticsWowHub";

import { 
  AlertOctagon, 
  FileText,
  ChevronRight,
  Layers
} from "lucide-react";

const DEFAULT_EXPEDITIONS: Expedition[] = [
  {
    id: "EXP-44-ANT-01",
    code: "44-IAE-MAITRI",
    name: "44th Indian Antarctic Scientific Expedition (Maitri & Bharati)",
    nameHi: "44वां भारतीय अंटार्कटिक वैज्ञानिक अभियान (मैत्री एवं भारती)",
    region: "ANTARCTICA",
    leaderName: "Dr. Arvind Shrivastava (NCPOR)",
    startDate: "2026-11-01",
    endDate: "2027-03-25",
    status: "ACTIVE",
    baseStation: "MAITRI",
    crewSize: 42,
    routeGeoJSON: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [11.735, -70.766],
              [11.85, -70.82],
              [12.1, -70.95],
              [76.187, -69.407],
            ],
          },
          properties: { name: "Schirmacher to Larsemann Hills Traverse Corridor" },
        },
      ],
    },
    fuelCalculations: {
      dieselLiters: 185000,
      jetA1Liters: 42000,
      dailyBurnRateLiters: 1450,
      reserveMarginPct: 25,
      estimatedDaysAutonomy: 156,
    },
    environmentalClearance: {
      permitNumber: "MoES/EIA/ANT/2026/09",
      madridProtocolCompliant: true,
      wasteManagementTier: "TIER_1_RETURN_TO_INDIA",
      aspaOverflightPermit: true,
    },
  },
  {
    id: "EXP-18-ARC-02",
    code: "18-IASE-HIMADRI",
    name: "18th Indian Arctic Expedition (Himadri, Ny-Ålesund, Svalbard)",
    nameHi: "18वां भारतीय आर्कटिक अभियान (हिमाद्री, स्वालबार्ड)",
    region: "ARCTIC",
    leaderName: "Dr. K. P. Meena (NCPOR)",
    startDate: "2026-06-15",
    endDate: "2026-10-30",
    status: "ACTIVE",
    baseStation: "HIMADRI",
    crewSize: 18,
    routeGeoJSON: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [11.933, 78.923],
              [12.2, 78.98],
              [12.5, 79.05],
            ],
          },
          properties: { name: "Kongsfjorden Cryosphere Marine Sampling Route" },
        },
      ],
    },
    fuelCalculations: {
      dieselLiters: 45000,
      jetA1Liters: 12000,
      dailyBurnRateLiters: 420,
      reserveMarginPct: 30,
      estimatedDaysAutonomy: 135,
    },
    environmentalClearance: {
      permitNumber: "MoES/EIA/ARC/2026/03",
      madridProtocolCompliant: true,
      wasteManagementTier: "TIER_1_RETURN_TO_INDIA",
      aspaOverflightPermit: false,
    },
  },
];

const DEFAULT_ASSETS: Asset[] = [
  {
    id: "AST-VESSEL-01",
    code: "MV-VASILIY-GOLOVNIN",
    name: "Chartered Polar Vessel MV Vasiliy Golovnin",
    category: "VESSEL",
    assignedExpeditionId: "EXP-44-ANT-01",
    currentLocationName: "Prydz Bay Approach to Bharati Station",
    latitude: -69.21,
    longitude: 76.05,
    temperatureC: -18.4,
    batteryPct: 98,
    shockG: 0.12,
    chainOfCustody: {
      currentHolder: "Capt. Igor Voronov / MoES Voyage Leader",
      lastVerifiedAt: new Date().toISOString(),
      rfidTag: "RFID-9002-VESSEL-01",
      qrCode: "QR-MV-VASILIY-2026",
    },
    status: "ACTIVE",
  },
  {
    id: "AST-PB-01",
    code: "PISTENBULLY-300-POLAR-01",
    name: "Heavy Traverse Snowcat PistenBully 300P (Unit A)",
    category: "SNOWCAT_PISTENBULLY",
    assignedExpeditionId: "EXP-44-ANT-01",
    currentLocationName: "Schirmacher Oasis Inland Plateau",
    latitude: -70.82,
    longitude: 11.95,
    temperatureC: -28.6,
    batteryPct: 84,
    shockG: 0.45,
    chainOfCustody: {
      currentHolder: "Er. Rajesh Kumar (NCPOR Vehicle Div)",
      lastVerifiedAt: new Date().toISOString(),
      rfidTag: "RFID-PB-300-01",
      qrCode: "QR-PB300-UNIT-A",
    },
    status: "ACTIVE",
  },
  {
    id: "AST-AWS-01",
    code: "AWS-MAITRI-GLACIER",
    name: "Automatic Weather Station (Continental Shelf Glaciology)",
    category: "AWS_WEATHER_STATION",
    assignedExpeditionId: "EXP-44-ANT-01",
    currentLocationName: "Dakshin Gangotri Ice Shelf Marker",
    latitude: -70.08,
    longitude: 12.01,
    temperatureC: -32.1,
    batteryPct: 92,
    shockG: 0.05,
    chainOfCustody: {
      currentHolder: "IMD Polar Observation Team",
      lastVerifiedAt: new Date().toISOString(),
      rfidTag: "RFID-AWS-IMD-01",
      qrCode: "QR-AWS-MAITRI-01",
    },
    status: "ACTIVE",
  },
  {
    id: "AST-SNOWMOBILE-02",
    code: "LYNX-6900-FIELD-02",
    name: "BRP Lynx Commander Polar Snowmobile (Scout 2)",
    category: "SNOWMOBILE",
    assignedExpeditionId: "EXP-44-ANT-01",
    currentLocationName: "Larsemann Hills Field Camp",
    latitude: -69.41,
    longitude: 76.19,
    temperatureC: -22.3,
    batteryPct: 76,
    shockG: 0.88,
    chainOfCustody: {
      currentHolder: "Dr. Arvind Shrivastava",
      lastVerifiedAt: new Date().toISOString(),
      rfidTag: "RFID-LYNX-02",
      qrCode: "QR-LYNX-FIELD-02",
    },
    status: "ACTIVE",
  },
  {
    id: "AST-HIMADRI-UAV",
    code: "ARCTIC-AEROMAP-UAV-01",
    name: "Arctic Cryo-Survey Drone UAV (Svalbard Front)",
    category: "DRONE_UAV",
    assignedExpeditionId: "EXP-18-ARC-02",
    currentLocationName: "Himadri Station Launch Pad",
    latitude: 78.92,
    longitude: 11.93,
    temperatureC: -14.2,
    batteryPct: 91,
    shockG: 0.08,
    chainOfCustody: {
      currentHolder: "NCPOR UAV Cryosphere Lab",
      lastVerifiedAt: new Date().toISOString(),
      rfidTag: "RFID-UAV-ARC-01",
      qrCode: "QR-UAV-HIMADRI-01",
    },
    status: "ACTIVE",
  },
];

export default function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [highContrast, setHighContrast] = useState(false);
  const [currentStation, setCurrentStation] = useState<string>("MAITRI");

  // Two-Level Navigation Hierarchy States
  const [activeParentModule, setActiveParentModule] = useState<ParentModuleId>("mission-control");
  const [activeSubModule, setActiveSubModule] = useState<SubModuleId>("overview");
  const [isSecondaryPanelCollapsed, setIsSecondaryPanelCollapsed] = useState<boolean>(false);
  const [isMobilePwaMode, setIsMobilePwaMode] = useState<boolean>(false);

  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [isMorningBriefOpen, setIsMorningBriefOpen] = useState<boolean>(false);
  const [isStoryDemoOpen, setIsStoryDemoOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [activeCargoPassportId, setActiveCargoPassportId] = useState<string | null>(null);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // RBAC & Theme States for SIH 062
  const [userRole, setUserRole] = useState<UserRole>("ADMIN");
  const [theme, setTheme] = useState<AppTheme>("DARK");

  // Core Data States
  const [expeditions, setExpeditions] = useState<Expedition[]>(DEFAULT_EXPEDITIONS);
  const [assets, setAssets] = useState<Asset[]>(DEFAULT_ASSETS);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([]);
  const [liveWeather, setLiveWeather] = useState<WeatherData | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [sosBannerNotice, setSosBannerNotice] = useState<string | null>(null);

  // Universal Tab Navigator supporting both Parent Modules & Sub-Features
  const handleNavigate = (target: string) => {
    if (target === "mobile-pwa") {
      setIsMobilePwaMode(true);
      return;
    }
    setIsMobilePwaMode(false);

    // Parent Module Direct Hits
    if (target === "mission-control") {
      setActiveParentModule("mission-control");
      setActiveSubModule("overview");
      return;
    }
    if (target === "expedition-mgmt") {
      setActiveParentModule("expedition-mgmt");
      setActiveSubModule("timeline");
      return;
    }
    if (target === "logistics-assets") {
      setActiveParentModule("logistics-assets");
      setActiveSubModule("cargo");
      return;
    }
    if (target === "personnel-safety") {
      setActiveParentModule("personnel-safety");
      setActiveSubModule("personnel-twin");
      return;
    }
    if (target === "gis-disaster") {
      setActiveParentModule("gis-disaster");
      setActiveSubModule("disaster-dashboard");
      return;
    }
    if (target === "expedition-intelligence") {
      setActiveParentModule("expedition-intelligence");
      setActiveSubModule("route-intel");
      return;
    }
    if (target === "simulation-ai") {
      setActiveParentModule("simulation-ai");
      setActiveSubModule("simulator");
      return;
    }
    if (target === "emergency-response") {
      setActiveParentModule("emergency-response");
      setActiveSubModule("emergency-command");
      return;
    }

    // Sub-Module & Legacy Tab mappings
    switch (target) {
      case "overview":
        setActiveParentModule("mission-control");
        setActiveSubModule("overview");
        break;
      case "digital-twin":
        setActiveParentModule("mission-control");
        setActiveSubModule("digital-twin");
        break;
      case "reports":
        setActiveParentModule("mission-control");
        setActiveSubModule("reports");
        break;
      case "timeline":
      case "expeditions":
        setActiveParentModule("expedition-mgmt");
        setActiveSubModule("timeline");
        break;
      case "planner":
        setActiveParentModule("expedition-mgmt");
        setActiveSubModule("planner");
        break;
      case "telemetry":
      case "map-telemetry":
        setActiveParentModule("expedition-mgmt");
        setActiveSubModule("telemetry");
        break;
      case "cargo":
      case "cargo-passport":
        setActiveParentModule("logistics-assets");
        setActiveSubModule("cargo");
        break;
      case "inventory":
      case "analytics":
        setActiveParentModule("logistics-assets");
        setActiveSubModule("inventory");
        break;
      case "resources":
      case "resource-intelligence":
        setActiveParentModule("logistics-assets");
        setActiveSubModule("resources");
        break;
      case "smart-resupply":
        setActiveParentModule("logistics-assets");
        setActiveSubModule("smart-resupply");
        break;
      case "personnel-twin":
      case "personnel":
        setActiveParentModule("personnel-safety");
        setActiveSubModule("personnel-twin");
        break;
      case "personnel-roster":
        setActiveParentModule("personnel-safety");
        setActiveSubModule("personnel-roster");
        break;
      case "disaster-dashboard":
        setActiveParentModule("gis-disaster");
        setActiveSubModule("disaster-dashboard");
        break;
      case "gis-3d-dem":
        setActiveParentModule("gis-disaster");
        setActiveSubModule("gis-3d-dem");
        break;
      case "citizen-incident":
      case "incidents-citizens":
        setActiveParentModule("gis-disaster");
        setActiveSubModule("citizen-incident");
        break;
      case "analytics-wow":
        setActiveParentModule("gis-disaster");
        setActiveSubModule("analytics-wow");
        break;
      case "route-intel":
      case "route-intelligence":
        setActiveParentModule("expedition-intelligence");
        setActiveSubModule("route-intel");
        break;
      case "weather-impact":
        setActiveParentModule("expedition-intelligence");
        setActiveSubModule("weather-impact");
        break;
      case "simulator":
        setActiveParentModule("simulation-ai");
        setActiveSubModule("simulator");
        break;
      case "ai-copilot":
        setActiveParentModule("simulation-ai");
        setActiveSubModule("ai-copilot");
        break;
      case "emergency-command":
        setActiveParentModule("emergency-response");
        setActiveSubModule("emergency-command");
        break;
      case "incident-sos":
      case "incidents":
        setActiveParentModule("emergency-response");
        setActiveSubModule("incident-sos");
        break;
      default:
        setActiveParentModule("mission-control");
        setActiveSubModule("overview");
    }
  };

  const handleSelectParentModule = (modId: ParentModuleId) => {
    setActiveParentModule(modId);
    const config = MODULE_CONFIGS[modId];
    if (config && config.subModules.length > 0) {
      setActiveSubModule(config.subModules[0].id);
    }
    setIsMobilePwaMode(false);
  };

  const handleSelectSubModule = (subId: SubModuleId) => {
    setActiveSubModule(subId);
  };

  // Online / offline detector
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch initial data from Express backend
  useEffect(() => {
    // 1. Expeditions
    fetch("/api/expeditions")
      .then((res) => res.json())
      .then((data) => {
        if (data.expeditions && data.expeditions.length > 0) setExpeditions(data.expeditions);
      })
      .catch((e) => console.warn("Expeditions fetch fallback", e));

    // 2. Assets
    fetch("/api/assets")
      .then((res) => res.json())
      .then((data) => {
        if (data.assets && data.assets.length > 0) setAssets(data.assets);
      })
      .catch((e) => console.warn("Assets fetch fallback", e));

    // 3. Inventory from backend DB
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setInventory(data.items);
        }
      })
      .catch((e) => console.warn("Inventory fetch fallback", e));

    // 4. Personnel from backend DB
    fetch("/api/personnel")
      .then((res) => res.json())
      .then((data) => {
        if (data.personnel && data.personnel.length > 0) {
          setPersonnel(data.personnel);
        }
      })
      .catch((e) => console.warn("Personnel fetch fallback", e));

    // 5. Incidents from backend DB
    fetch("/api/incidents")
      .then((res) => res.json())
      .then((data) => {
        if (data.incidents && data.incidents.length > 0) {
          setIncidents(data.incidents);
        }
      })
      .catch((e) => console.warn("Incidents fetch fallback", e));
  }, []);

  // Fetch live weather data for the current station
  useEffect(() => {
    fetch(`/api/weather/live?station=${currentStation}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.weather) setLiveWeather(data.weather);
      })
      .catch((e) => console.warn("Live weather fetch fallback", e));

    const timer = setInterval(() => {
      fetch(`/api/weather/live?station=${currentStation}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.weather) setLiveWeather(data.weather);
        })
        .catch(() => {});
    }, 30000);

    return () => clearInterval(timer);
  }, [currentStation]);

  // Connect to SSE stream (/api/telemetry/stream)
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/telemetry/stream");

      eventSource.onmessage = (event) => {
        try {
          const telemetryData: TelemetryPoint = JSON.parse(event.data);
          setTelemetryHistory((prev) => [...prev.slice(-39), telemetryData]);

          const mappedStatus: Asset["status"] =
            telemetryData.status === "critical" || telemetryData.status === "warning"
              ? "ALERT"
              : telemetryData.status === "offline"
              ? "STANDBY"
              : "ACTIVE";

          // Update the matching asset in state
          setAssets((prevAssets) =>
            prevAssets.map((asset) => {
              if (asset.id === telemetryData.assetId) {
                return {
                  ...asset,
                  latitude: telemetryData.latitude,
                  longitude: telemetryData.longitude,
                  temperatureC: telemetryData.temperatureC,
                  batteryPct: telemetryData.batteryPct,
                  shockG: telemetryData.shockG,
                  status: mappedStatus,
                };
              }
              return asset;
            })
          );
        } catch (e) {
          // ignore parsing error
        }
      };

      eventSource.onerror = () => {
        // SSE connection dropped, will automatically attempt reconnect
      };
    } catch (e) {
      console.warn("EventSource not supported or failed", e);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Handlers with persistent backend sync
  const handleExpeditionCreated = (newExp: Expedition) => {
    setExpeditions((prev) => [newExp, ...prev]);
    fetch("/api/expeditions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExp),
    }).catch((err) => console.warn("Expedition create sync warning", err));
  };

  const handlePublishExpedition = (id: string) => {
    setExpeditions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "ACTIVE" } : e))
    );
    fetch(`/api/expeditions/${id}/publish`, {
      method: "PATCH",
    }).catch((err) => console.warn("Expedition publish sync warning", err));
  };

  const handleUpdateAsset = (updated: Asset) => {
    setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    fetch(`/api/assets/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch((err) => console.warn("Asset update sync warning", err));
  };

  const handleAddNewAsset = (assetData: Partial<Asset>) => {
    const newAsset: Asset = {
      id: `AST-${Date.now().toString().slice(-4)}`,
      code: assetData.code || "AST-NEW-01",
      name: assetData.name || "Newly Commissioned Asset",
      category: assetData.category || "CARGO_SLEDGE",
      assignedExpeditionId: "EXP-44-ANT-01",
      status: "ACTIVE",
      currentLocationName: assetData.currentLocationName || "Bharati Staging Area",
      latitude: assetData.latitude || -69.4,
      longitude: assetData.longitude || 76.2,
      temperatureC: -22.4,
      batteryPct: 98,
      shockG: 0.12,
      chainOfCustody: {
        currentHolder: "Station Commander",
        lastVerifiedAt: new Date().toISOString(),
        rfidTag: `RFID-MTR-${Date.now().toString().slice(-4)}`,
        qrCode: `QR-POLAR-${Date.now().toString().slice(-4)}`,
      },
    };
    setAssets((prev) => [newAsset, ...prev]);
    fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAsset),
    }).catch((err) => console.warn("Asset add sync warning", err));
  };

  const handleAddInventoryItem = (itemData: Partial<InventoryItem>) => {
    const newItem: InventoryItem = {
      sku: itemData.sku || `SKU-${Date.now().toString().slice(-4)}`,
      name: itemData.name || "New Consumable Item",
      category: itemData.category || "RATIONS_COLD_CHAIN",
      quantity: itemData.quantity || 50,
      unit: itemData.unit || "Packs",
      minThreshold: itemData.minThreshold || 10,
      expiryDate: itemData.expiryDate || "2027-12-31",
      storageTempC: itemData.storageTempC || "-20°C",
      location: itemData.location || "Storage Depot",
      batchLot: itemData.batchLot || "LOT-NEW",
      status: "IN_STOCK",
    };
    setInventory((prev) => [newItem, ...prev]);
    fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    }).catch((err) => console.warn("Inventory add sync warning", err));
  };

  const handleReplenish = (sku: string, amount: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, quantity: item.quantity + amount, status: "IN_STOCK" } : item
      )
    );
    fetch(`/api/inventory/${sku}/replenish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).catch((err) => console.warn("Inventory replenish sync warning", err));
  };

  const handleUpdatePersonnelStatus = (id: string, newStatus: Personnel["checkInStatus"]) => {
    setPersonnel((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, checkInStatus: newStatus, lastCheckInTime: new Date().toISOString() } : p
      )
    );
    fetch("/api/personnel/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personnelId: id, status: newStatus }),
    }).catch((err) => console.warn("Personnel status sync warning", err));
  };

  const handleTriggerSos = (payload: Partial<Incident>) => {
    const newIncident: Incident = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      code: `SOS-${currentStation.slice(0, 3)}-${Date.now().toString().slice(-3)}`,
      severity: "SOS_CRITICAL",
      type: payload.type || "CREVASSE_FALL",
      description: payload.description || "Emergency distress call triggered from polar sector",
      location: {
        latitude: payload.location?.latitude || (currentStation === "HIMADRI" ? 78.92 : -70.76),
        longitude: payload.location?.longitude || (currentStation === "HIMADRI" ? 11.93 : 11.73),
        description: payload.location?.description || `${currentStation} Field Grid`,
      },
      expeditionId: expeditions[0]?.code || "EXP-ANT-2026",
      triggeredAt: new Date().toISOString(),
      status: "TRIGGERED",
      escalationLog: [
        {
          tier: "Level 1 - Station Commander",
          notifiedParty: `${currentStation} Station Duty Officer`,
          channel: "VHF_RADIO",
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setSosBannerNotice(`🚨 EMERGENCY SOS DISPATCHED: ${newIncident.code} - Escalated to Base VHF & NCPOR Goa`);
    setIsEmergencyActive(true);
    handleNavigate("emergency-command");

    fetch("/api/incidents/sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expeditionId: newIncident.expeditionId,
        latitude: newIncident.location.latitude,
        longitude: newIncident.location.longitude,
        description: newIncident.description,
        type: newIncident.type,
      }),
    }).catch((err) => console.warn("SOS dispatch sync warning", err));
  };

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: "RESOLVED" } : inc))
    );
    fetch(`/api/incidents/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RESOLVED" }),
    }).catch((err) => console.warn("Incident resolve sync warning", err));
  };

  const t = (text: string) => translate(text, language);

  const activeParentConfig = MODULE_CONFIGS[activeParentModule] || MODULE_CONFIGS["mission-control"];
  const currentSubConfig = activeParentConfig.subModules.find((s) => s.id === activeSubModule) || activeParentConfig.subModules[0];
  const SubIcon = currentSubConfig?.icon || Layers;

  return (
    <I18nProvider language={language} setLanguage={setLanguage}>
      <div
        key={`app-lang-${language}`}
        className={`min-h-screen transition-colors ${
          highContrast
            ? "bg-black text-white"
            : theme === "PASTEL_LIGHT"
            ? "bg-[#f5efe6] text-slate-800"
            : "bg-[#030712] text-slate-100"
        }`}
      >
        {/* Global App Header */}
        <Header
          language={language}
          setLanguage={setLanguage}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          currentStation={currentStation}
          setCurrentStation={setCurrentStation}
          activeView={isMobilePwaMode ? "mobile-pwa" : activeParentModule}
          setActiveView={(v) => handleNavigate(v)}
          onQuickSosClick={() => handleTriggerSos({ description: "Global Header One-Tap SOS Activated" })}
          onOpenDocs={() => setShowDocsModal(true)}
          isOnline={isOnline}
          userRole={userRole}
          setUserRole={setUserRole}
          theme={theme}
          setTheme={setTheme}
        />

        {/* Emergency Global Alert Notification Toast */}
        {sosBannerNotice && (
          <div className="bg-red-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-md animate-pulse">
            <div className="flex items-center gap-2 max-w-7xl mx-auto">
              <AlertOctagon className="w-4 h-4" />
              <span>{sosBannerNotice}</span>
            </div>
            <button
              onClick={() => setSosBannerNotice(null)}
              className="text-white hover:text-red-200 text-xs underline font-normal cursor-pointer"
            >
              {t("Dismiss")}
            </button>
          </div>
        )}

        {/* Main Container */}
        <main className="max-w-7xl mx-auto p-3 sm:p-5 space-y-4">
          {/* Continuous Expedition Mission Health Bar */}
          {!isMobilePwaMode && (
            <MissionHealthBar
              currentStation={currentStation}
              onOpenCopilot={() => handleNavigate("ai-copilot")}
            />
          )}

          {/* Level 1 Navigation Tabs Bar: Only 7–8 High-Level Modules */}
          {!isMobilePwaMode && (
            <CommandNav
              activeParentModule={activeParentModule}
              onSelectParentModule={handleSelectParentModule}
              isEmergencyActive={isEmergencyActive}
              onOpenMorningBrief={() => setIsMorningBriefOpen(true)}
              onOpenStoryDemo={() => setIsStoryDemoOpen(true)}
              onOpenScanQr={() => setActiveCargoPassportId("POLAR-CN-104")}
            />
          )}

          {/* Level 2 Workspace: Secondary Module Panel + Active Sub-Feature Content */}
          {!isMobilePwaMode ? (
            <div className="flex flex-col md:flex-row items-start gap-4">
              {/* Secondary Module Panel (Contextual sub-features of the active parent module) */}
              <SecondaryModulePanel
                parentModule={activeParentModule}
                activeSubModule={activeSubModule}
                onSelectSubModule={handleSelectSubModule}
                isCollapsed={isSecondaryPanelCollapsed}
                onToggleCollapse={() => setIsSecondaryPanelCollapsed(!isSecondaryPanelCollapsed)}
                isEmergencyActive={isEmergencyActive}
              />

              {/* Active Sub-Feature Content Canvas */}
              <div className="flex-1 min-w-0 w-full space-y-3">
                {/* Contextual Sub-Feature Header & Quick Breadcrumb */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      {language === "hi" ? activeParentConfig.titleHi : activeParentConfig.title}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 truncate">
                      <SubIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {language === "hi" ? currentSubConfig?.labelHi : currentSubConfig?.label}
                    </span>
                  </div>

                  {/* Horizontal Quick Switcher Pill Strip */}
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin py-0.5">
                    {activeParentConfig.subModules.map((sub) => {
                      const isActive = activeSubModule === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSubModule(sub.id)}
                          className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded-md transition whitespace-nowrap ${
                            isActive
                              ? activeParentConfig.isEmergency || sub.isDanger
                                ? "bg-red-600 text-white shadow-xs font-bold"
                                : "bg-cyan-600 text-white shadow-xs font-bold"
                              : "text-slate-400 hover:text-white hover:bg-slate-900"
                          }`}
                        >
                          {language === "hi" ? sub.labelHi : sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 1. MISSION CONTROL MODULE VIEWS */}
                {activeParentModule === "mission-control" && activeSubModule === "overview" && (
                  <MissionControlOverview
                    onNavigateTab={(tab) => handleNavigate(tab)}
                    onOpenMorningBrief={() => setIsMorningBriefOpen(true)}
                    onOpenStoryDemo={() => setIsStoryDemoOpen(true)}
                  />
                )}

                {activeParentModule === "mission-control" && activeSubModule === "digital-twin" && (
                  <PolarDigitalTwin
                    currentStation={currentStation}
                    onOpenCargoPassport={(id) => setActiveCargoPassportId(id)}
                    onOpenCopilot={() => handleNavigate("ai-copilot")}
                    onOpenSimulator={() => handleNavigate("simulator")}
                    onTriggerSos={() => {
                      setIsEmergencyActive(true);
                      handleNavigate("emergency-command");
                    }}
                  />
                )}

                {activeParentModule === "mission-control" && activeSubModule === "reports" && (
                  <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-5 sm:p-7 shadow-xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                      <div>
                        <h2 className="text-lg font-black font-mono tracking-tight text-white uppercase flex items-center gap-2">
                          <FileText className="w-5 h-5 text-cyan-400" />
                          <span>{t("Expedition Mission Reports & Documentation Hub")}</span>
                        </h2>
                        <p className="text-xs text-slate-400 font-sans mt-0.5">
                          {t("Automated regulatory compliance, Madrid Protocol certificates, telemetry audit logs, and commander situation dossiers.")}
                        </p>
                      </div>

                      <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition shadow-lg shadow-cyan-950 self-start sm:self-auto cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{t("Export Madrid Report")}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        onClick={() => setIsReportModalOpen(true)}
                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition space-y-2"
                      >
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                          {language === "hi" ? "दैनिक कार्यकारी सिटरैप" : "DAILY EXECUTIVE SITREP"}
                        </span>
                        <h3 className="text-sm font-bold text-white font-mono">
                          {language === "hi" ? "44वां आईएई स्थिति एवं स्वास्थ्य रिपोर्ट" : "44th IAE Situation & Health Report"}
                        </h3>
                        <p className="text-xs text-slate-400 font-sans">
                          {language === "hi" ? "स्टेशनों, ईंधन भंडार, टीम सुरक्षा और प्रिड्ज़ बे समुद्री बर्फ का व्यापक ऑडिट।" : "Comprehensive audit of stations, fuel reserves, team safety, and Prydz Bay sea ice compaction."}
                        </p>
                        <div className="pt-2 text-[11px] text-cyan-300 font-mono flex items-center gap-1">
                          <span>{language === "hi" ? "डोजियर देखें →" : "View Dossier →"}</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setIsReportModalOpen(true)}
                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition space-y-2"
                      >
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                          {t("OVERALL DASHBOARD SUMMARY")}
                        </span>
                        <h3 className="text-sm font-bold text-white font-mono">
                          {t("Consolidated Operations & Systems Overview")}
                        </h3>
                        <p className="text-xs text-slate-400 font-sans">
                          {language === "hi" 
                            ? `वास्तविक समय स्थिति: ${expeditions.length} अभियान, ${assets.length} ट्रैक संपत्तियां, ${personnel.length} दल सदस्य, एवं ${inventory.length} आपूर्ति लाइनें।`
                            : `Real-time status across ${expeditions.length} expeditions, ${assets.length} tracked assets, ${personnel.length} crew members, and ${inventory.length} supply lines.`}
                        </p>
                        <div className="pt-2 text-[11px] text-emerald-300 font-mono flex items-center gap-1">
                          <span>{t("View Overall Summary →")}</span>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveCargoPassportId("POLAR-CN-104")}
                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition space-y-2"
                      >
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                          {language === "hi" ? "कस्टडी श्रृंखला" : "CHAIN OF CUSTODY"}
                        </span>
                        <h3 className="text-sm font-bold text-white font-mono">
                          {language === "hi" ? "डिजिटल कार्गो पासपोर्ट प्रमाणपत्र" : "Digital Cargo Passport Certificates"}
                        </h3>
                        <p className="text-xs text-slate-400 font-sans">
                          {language === "hi" ? "कोल्ड-चेन टीका तापमान, शॉक सेंसर रिकॉर्ड और एसएचए-256 छेड़छाड़ सील।" : "Cold-chain vaccine temperatures, shock sensor records, and SHA-256 tamper seal manifests."}
                        </p>
                        <div className="pt-2 text-[11px] text-amber-300 font-mono flex items-center gap-1">
                          <span>{language === "hi" ? "स्मार्ट सील सत्यापित करें →" : "Verify Smart Seal →"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Overall Dashboard Operational Summary Panel */}
                    <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 sm:p-5 space-y-4 font-mono">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            {t("Current Dashboard State & Systems Telemetry")}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {t("Last Updated:")} {new Date().toLocaleTimeString()} • {t("Station:")} {currentStation}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 space-y-1">
                          <span className="text-[10px] text-slate-500 block uppercase">{t("Expeditions")}</span>
                          <span className="text-base font-bold text-cyan-400">
                            {expeditions.filter((e) => e.status === "ACTIVE").length} / {expeditions.length}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-sans">{t("Active Missions")}</span>
                        </div>

                        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 space-y-1">
                          <span className="text-[10px] text-slate-500 block uppercase">{t("Tracked Fleet")}</span>
                          <span className="text-base font-bold text-emerald-400">
                            {assets.filter((a) => a.status === "ACTIVE").length} / {assets.length}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-sans">{t("Online Assets")}</span>
                        </div>

                        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 space-y-1">
                          <span className="text-[10px] text-slate-500 block uppercase">{t("Expedition Crew")}</span>
                          <span className="text-base font-bold text-white">
                            {personnel.length} {language === "hi" ? "सदस्य" : "Staff"}
                          </span>
                          <span className="text-[10px] text-emerald-400 block font-sans">{t("100% Accounted")}</span>
                        </div>

                        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 space-y-1">
                          <span className="text-[10px] text-slate-500 block uppercase">{t("Inventory Stock")}</span>
                          <span className="text-base font-bold text-amber-400">
                            {inventory.filter((i) => i.status === "IN_STOCK").length} SKUs
                          </span>
                          <span className="text-[10px] text-slate-400 block font-sans">{t("Cold-Chain Nominal")}</span>
                        </div>

                        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 space-y-1">
                          <span className="text-[10px] text-slate-500 block uppercase">{t("Incident Record")}</span>
                          <span className="text-base font-bold text-emerald-400">
                            {incidents.filter((i) => i.status === "RESOLVED").length} {t("Resolved")}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-sans">
                            {incidents.filter((i) => i.status !== "RESOLVED").length} {t("Active Alerts")}
                          </span>
                        </div>

                        <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 space-y-1">
                          <span className="text-[10px] text-slate-500 block uppercase">{t("Live Weather")}</span>
                          <span className="text-base font-bold text-sky-400">
                            {liveWeather?.current?.temperatureC ?? -22.5}°C
                          </span>
                          <span className="text-[10px] text-slate-400 block font-sans">
                            {t("Wind")} {liveWeather?.current?.windSpeedKmh ?? 35} km/h
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. EXPEDITION MANAGEMENT MODULE VIEWS */}
                {activeParentModule === "expedition-mgmt" && activeSubModule === "timeline" && (
                  <ExpeditionTimelineView />
                )}

                {activeParentModule === "expedition-mgmt" && activeSubModule === "planner" && (
                  <PlannerView
                    expeditions={expeditions}
                    language={language}
                    onExpeditionCreated={handleExpeditionCreated}
                    onPublishExpedition={handlePublishExpedition}
                  />
                )}

                {activeParentModule === "expedition-mgmt" && activeSubModule === "telemetry" && (
                  <MapTelemetryView
                    assets={assets}
                    telemetryHistory={telemetryHistory}
                    liveWeather={liveWeather}
                    currentStation={currentStation}
                    language={language}
                    onSelectAsset={() => {}}
                    onTriggerSosForAsset={(id) => handleTriggerSos({ description: `Asset ${id} Telemetry Alert SOS` })}
                  />
                )}

                {/* 3. LOGISTICS & ASSETS MODULE VIEWS */}
                {activeParentModule === "logistics-assets" && activeSubModule === "cargo" && (
                  <AssetCargoView
                    assets={assets}
                    language={language}
                    onUpdateAsset={handleUpdateAsset}
                    onAddNewAsset={handleAddNewAsset}
                  />
                )}

                {activeParentModule === "logistics-assets" && activeSubModule === "inventory" && (
                  <InventoryView
                    inventory={inventory}
                    language={language}
                    onAddItem={handleAddInventoryItem}
                    onReplenish={handleReplenish}
                  />
                )}

                {activeParentModule === "logistics-assets" && activeSubModule === "resources" && (
                  <ResourceDigitalTwinView
                    onOpenSimulator={() => handleNavigate("simulator")}
                  />
                )}

                {activeParentModule === "logistics-assets" && activeSubModule === "smart-resupply" && (
                  <SmartResupplyView
                    currentStation={currentStation}
                    onNavigateToDigitalTwin={() => handleNavigate("digital-twin")}
                  />
                )}

                {/* 4. PERSONNEL & SAFETY MODULE VIEWS */}
                {activeParentModule === "personnel-safety" && activeSubModule === "personnel-twin" && (
                  <PersonnelDigitalTwinView
                    onTriggerEmergency={() => {
                      setIsEmergencyActive(true);
                      handleNavigate("emergency-command");
                    }}
                  />
                )}

                {activeParentModule === "personnel-safety" && activeSubModule === "personnel-roster" && (
                  <PersonnelRosterView
                    personnel={personnel}
                    language={language}
                    onUpdatePersonnelStatus={handleUpdatePersonnelStatus}
                  />
                )}

                {/* 5. 3D GIS & DISASTER MODULE VIEWS */}
                {activeParentModule === "gis-disaster" && activeSubModule === "disaster-dashboard" && (
                  <DynamicDisasterDashboard
                    userRole={userRole}
                    theme={theme}
                    onNavigateToGis={() => handleNavigate("gis-3d-dem")}
                    onNavigateToCitizen={() => handleNavigate("citizen-incident")}
                    onNavigateToAnalytics={() => handleNavigate("analytics-wow")}
                  />
                )}

                {activeParentModule === "gis-disaster" && activeSubModule === "gis-3d-dem" && (
                  <Gis3dTerrainView
                    userRole={userRole}
                    theme={theme}
                  />
                )}

                {activeParentModule === "gis-disaster" && activeSubModule === "citizen-incident" && (
                  <CitizenIncidentModule
                    userRole={userRole}
                    theme={theme}
                    isOnline={isOnline}
                  />
                )}

                {activeParentModule === "gis-disaster" && activeSubModule === "analytics-wow" && (
                  <AnalyticsWowHub
                    userRole={userRole}
                    theme={theme}
                  />
                )}

                {/* 6. EXPEDITION INTELLIGENCE MODULE VIEWS */}
                {activeParentModule === "expedition-intelligence" && activeSubModule === "route-intel" && (
                  <RouteIntelligenceView />
                )}

                {activeParentModule === "expedition-intelligence" && activeSubModule === "weather-impact" && (
                  <WeatherImpactEngineView
                    onNavigateToRouteIntel={() => handleNavigate("route-intel")}
                    onNavigateToPersonnel={() => handleNavigate("personnel-twin")}
                  />
                )}

                {/* 7. SIMULATION & AI MODULE VIEWS */}
                {activeParentModule === "simulation-ai" && activeSubModule === "simulator" && (
                  <ExpeditionSimulatorView />
                )}

                {activeParentModule === "simulation-ai" && activeSubModule === "ai-copilot" && (
                  <PolarAiCopilotView
                    currentStation={currentStation}
                    onNavigateToSimulator={() => handleNavigate("simulator")}
                    onNavigateToResupply={() => handleNavigate("resources")}
                  />
                )}

                {/* 8. EMERGENCY RESPONSE MODULE VIEWS */}
                {activeParentModule === "emergency-response" && activeSubModule === "emergency-command" && (
                  <EmergencyCommandView
                    onPlanApproved={() => {}}
                    onNavigateToReport={() => setIsReportModalOpen(true)}
                  />
                )}

                {activeParentModule === "emergency-response" && activeSubModule === "incident-sos" && (
                  <IncidentSosView
                    incidents={incidents}
                    language={language}
                    onTriggerSos={handleTriggerSos}
                    onResolveIncident={handleResolveIncident}
                  />
                )}
              </div>
            </div>
          ) : (
            <MobileFieldPWAView
              language={language}
              currentStation={currentStation}
              assets={assets}
              onTriggerSos={handleTriggerSos}
              onCargoScanned={(cargoId, loc) => {
                setSosBannerNotice(`📦 ${t("Scan Cargo Container")}: ${cargoId} at ${loc}`);
                setActiveCargoPassportId(cargoId);
                setTimeout(() => setSosBannerNotice(null), 4000);
              }}
            />
          )}
        </main>

        {/* Cryptographic Digital Cargo Passport Modal */}
        {activeCargoPassportId && (
          <CargoPassportModal
            cargoId={activeCargoPassportId}
            onClose={() => setActiveCargoPassportId(null)}
            onScanAnother={(newId) => setActiveCargoPassportId(newId)}
          />
        )}

        {/* SIH 2026 Presentation Hub, OpenAPI, & ERD Modal */}
        {showDocsModal && <SihDocsModal onClose={() => setShowDocsModal(false)} />}

        {/* Commander 60-Second Morning Expedition Brief Modal */}
        {isMorningBriefOpen && (
          <MorningBriefModal
            onClose={() => setIsMorningBriefOpen(false)}
            onNavigate={(tab) => handleNavigate(tab)}
          />
        )}

        {/* Formal Expedition Status Report Modal */}
        {isReportModalOpen && (
          <ExpeditionReportModal onClose={() => setIsReportModalOpen(false)} />
        )}

        {/* SIH 2026 Interactive 15-Step Story Tour Controller */}
        {isStoryDemoOpen && (
          <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-[500px] z-50 animate-in slide-in-from-bottom-5 duration-300">
            <StoryDemoPlayer
              onClose={() => setIsStoryDemoOpen(false)}
              onNavigateTab={(tab) => handleNavigate(tab)}
              onSetEmergencyActive={(act) => setIsEmergencyActive(act)}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          </div>
        )}
      </div>
    </I18nProvider>
  );
}
