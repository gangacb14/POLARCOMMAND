export type Language = "en" | "hi";

export interface TelemetryPoint {
  assetId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  speedKmh: number;
  headingDeg: number;
  temperatureC: number;
  batteryPct: number;
  shockG: number;
  fuelRemainingPct: number;
  status: "nominal" | "warning" | "critical" | "offline";
  source: "IRIDIUM_SBD" | "CELLULAR_LTE" | "VHF_RADIO" | "MQTT_GATEWAY";
  rawPacketHex?: string;
}

export interface Expedition {
  id: string;
  code: string;
  name: string;
  nameHi: string;
  region: "ANTARCTICA" | "ARCTIC" | "SOUTHERN_OCEAN";
  leaderName: string;
  startDate: string;
  endDate: string;
  status: "PLANNING" | "APPROVED" | "ACTIVE" | "COMPLETED";
  baseStation: "MAITRI" | "BHARATI" | "HIMADRI" | "VESSEL_VASILIY_GOLOVNIN";
  crewSize: number;
  routeGeoJSON: {
    type: "FeatureCollection";
    features: any[];
  };
  fuelCalculations: {
    dieselLiters: number;
    jetA1Liters: number;
    dailyBurnRateLiters: number;
    reserveMarginPct: number;
    estimatedDaysAutonomy: number;
  };
  environmentalClearance: {
    permitNumber: string;
    madridProtocolCompliant: boolean;
    wasteManagementTier: "TIER_1_RETURN_TO_INDIA" | "TIER_2_INCINERATION";
    aspaOverflightPermit: boolean;
  };
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: "VESSEL" | "SNOWCAT_PISTENBULLY" | "SNOWMOBILE" | "AWS_WEATHER_STATION" | "CARGO_SLEDGE" | "DRONE_UAV";
  assignedExpeditionId: string;
  currentLocationName: string;
  latitude: number;
  longitude: number;
  temperatureC: number;
  batteryPct: number;
  shockG: number;
  chainOfCustody: {
    currentHolder: string;
    lastVerifiedAt: string;
    rfidTag: string;
    qrCode: string;
  };
  status: "ACTIVE" | "MAINTENANCE" | "ALERT" | "STANDBY";
}

export interface InventoryItem {
  sku: string;
  name: string;
  category: "RATIONS_COLD_CHAIN" | "SURVIVAL_GEAR" | "MEDICAL_SUPPLIES" | "SPARE_PARTS" | "FUEL_LUBRICANTS";
  quantity: number;
  unit: string;
  minThreshold: number;
  expiryDate: string;
  storageTempC: string;
  location: string;
  batchLot: string;
  status: "IN_STOCK" | "REORDER_TRIGGERED" | "EXPIRING_SOON" | "EXPIRED";
  daysUntilExpiry?: number;
}

export interface Personnel {
  id: string;
  serviceNumber: string;
  fullName: string;
  role: "EXPEDITION_LEADER" | "POLAR_LOGISTICS_OFFICER" | "METEOROLOGIST" | "MEDICAL_DOCTOR" | "FIELD_ENGINEER" | "SCIENTIST";
  stationAssigned: string;
  survivalQualified: boolean;
  medicalClearanceStatus: "CLEARED" | "RESTRICTED" | "CRITICAL_REVIEW";
  medicalFlagsEncrypted: string;
  medicalFlagsView?: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  checkInStatus: "CHECKED_IN" | "FIELD_TRAVERSE" | "TRANSIT" | "OFFLINE";
  lastCheckInTime: string;
}

export interface Incident {
  id: string;
  code: string;
  expeditionId: string;
  assetId?: string;
  personnelId?: string;
  severity: "SOS_CRITICAL" | "HIGH_DANGER" | "MEDIUM" | "LOW_ADVISORY";
  type: "CREVASSE_FALL" | "BLIZZARD_STRANDED" | "EQUIPMENT_FAILURE" | "MEDICAL_EMERGENCY" | "FUEL_LEAK";
  status: "TRIGGERED" | "ESCALATED_L2" | "ESCALATED_L3" | "RESOLVED";
  location: {
    latitude: number;
    longitude: number;
    description: string;
  };
  description: string;
  triggeredAt: string;
  escalationLog: Array<{
    tier: string;
    notifiedParty: string;
    channel: "IRIDIUM_SBD" | "SMS_GATEWAY" | "EMAIL_DISPATCH" | "VHF_RADIO";
    timestamp: string;
  }>;
}

export interface WeatherData {
  stationCode: string;
  stationName: string;
  coordinates: { latitude: number; longitude: number };
  dataSource: string;
  observedAt: string;
  current: {
    temperatureC: number;
    windChillC: number;
    humidityPct: number;
    windSpeedKmh: number;
    windDirectionDeg: number;
    windGustsKmh: number;
    pressureHpa: number;
    blizzardAlert: boolean;
    visibilityKm: number;
    seaIceConcentrationPct: number;
    uvIndex: number;
  };
  adaptersConfigured: {
    imdMosdacEndpoint: string;
    copernicusSeaIceEndpoint: string;
    noaaGfsPolarGrid: string;
    status: string;
  };
}

export interface OfflineQueueItem {
  id: string;
  type: "CHECK_IN" | "SOS" | "CARGO_SCAN";
  payload: any;
  timestamp: string;
  status: "QUEUED" | "SYNCING" | "SYNCED" | "FAILED";
}

export type OperationalState = "STABLE" | "ATTENTION" | "HIGH_RISK" | "CRITICAL";

export interface MissionHealthFactor {
  name: string;
  score: number; // 0 - 100
  weight: number;
  status: "nominal" | "warning" | "critical";
  detail: string;
}

export interface MissionHealth {
  overallScore: number;
  state: OperationalState;
  explanation: string;
  factors: MissionHealthFactor[];
  lastEvaluatedAt: string;
}

export interface AiInsight {
  id: string;
  category: "OBSERVATION" | "PREDICTION" | "RISK" | "RECOMMENDATION";
  title: string;
  observation: string;
  evidence: string;
  predictedImpact: string;
  recommendedAction: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: string;
}

export interface ResupplyRecommendation {
  id: string;
  category: "FUEL" | "FOOD_RATIONS" | "MEDICAL" | "SPARE_PARTS" | "SURVIVAL";
  resourceName: string;
  currentStock: string;
  consumptionRate: string;
  recommendedAddition: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "ROUTINE";
  reason: string;
  daysRemainingBeforeStockout: number;
  nextWindowDeliveryDays: number;
  stagedStation: string;
}

export interface SimulationResult {
  scenarioId: string;
  name: string;
  description: string;
  parameters: {
    vesselDelayDays: number;
    fuelBurnMultiplier: number;
    weatherSeverity: "NORMAL" | "MODERATE_STORM" | "SEVERE_BLIZZARD" | "WHITE_OUT";
    evacHeadcount: number;
    isolatedStation?: string;
  };
  currentPlan: {
    fuelRunwayDays: number;
    inventoryAutonomyDays: number;
    criticalShortageDate: string;
    missionRiskLevel: OperationalState;
    operationalCostIndex: number;
    personnelSafetyMarginPct: number;
  };
  simulatedScenario: {
    fuelRunwayDays: number;
    inventoryAutonomyDays: number;
    criticalShortageDate: string;
    missionRiskLevel: OperationalState;
    operationalCostIndex: number;
    personnelSafetyMarginPct: number;
    criticalShortagesList: string[];
    mitigationDirectives: string[];
  };
}

export interface CargoPassportTimelineEvent {
  step: "CREATED" | "PACKED" | "LOADED" | "DEPARTED" | "IN_TRANSIT" | "ARRIVED" | "VERIFIED";
  title: string;
  timestamp: string;
  location: string;
  verifiedBy: string;
  notes?: string;
  passed: boolean;
}

export interface CargoPassport {
  cargoId: string;
  name: string;
  description: string;
  category: "SCIENTIFIC_INSTRUMENTS" | "COLD_CHAIN_MEDICAL" | "POLAR_DIESEL" | "HIGH_CALORIE_RATIONS" | "HEAVY_SPARES";
  weightKg: number;
  origin: string;
  destination: string;
  priority: "Critical" | "High" | "Standard";
  currentLocation: string;
  carrierAssetId: string;
  status: "CREATED" | "PACKED" | "LOADED" | "DEPARTED" | "IN_TRANSIT" | "ARRIVED" | "VERIFIED";
  temperatureC: number;
  safeTempMinC: number;
  safeTempMaxC: number;
  shockG: number;
  shockLimitG: number;
  tamperSealIntact: boolean;
  rfidTag: string;
  qrPayload: string;
  timeline: CargoPassportTimelineEvent[];
}

export interface PolarRouteIntel {
  id: string;
  name: string;
  origin: string;
  port: string;
  vessel: string;
  polarRoute: string;
  destinationStation: string;
  distanceKm: number;
  estimatedTravelTimeDays: number;
  weatherRisk: "NOMINAL" | "MODERATE" | "SEVERE_BLIZZARD";
  cargoStatus: string;
  delayProbabilityPct: number;
  routeRisk: "LOW" | "MEDIUM" | "HIGH";
  riskExplanation: string;
  alternativeRouteName?: string;
  alternativeDistanceKm?: number;
  alternativeTravelTimeDays?: number;
}

export interface MovementStage {
  stage: "BASE" | "VESSEL" | "STATION" | "FIELD_CAMP" | "RETURN";
  location: string;
  status: "COMPLETED" | "ACTIVE" | "UPCOMING";
  timestamp?: string;
  eta?: string;
  notes?: string;
}

export interface PersonnelGroup {
  id: string;
  name: string;
  code: string;
  personnelCount: number;
  leader: string;
  roles: string[];
  station: string;
  currentLocation: string;
  coordinates: { lat: number; lon: number };
  safetyStatus: "OPTIMAL" | "CAUTION" | "HIGH_RISK" | "DISTRESS";
  communicationStatus: "STABLE" | "INTERMITTENT" | "OFFLINE";
  weatherRisk: "FAIR" | "MODERATE" | "HIGH_RISK" | "SEVERE_BLIZZARD";
  missionAssignment: string;
  returnWindowHours: number;
  assignedVehicle: string;
  suppliesStatus: {
    rationsDays: number;
    fuelLiters: number;
    medKits: number;
  };
  movementTimeline: MovementStage[];
}

export interface AiEmergencyResponsePlan {
  planId: string;
  generatedAt: string;
  headline: string;
  steps: string[];
  estimatedResponseTimeMins: number;
  resourcesRequired: Array<{ name: string; quantity: string; ready: boolean }>;
  selectedRoute: {
    name: string;
    distanceKm: number;
    hazardLevel: "LOW" | "MODERATE" | "HIGH";
    clearanceStatus: string;
  };
  deployedTeam: string;
  assignedVehicle: string;
  status: "GENERATED" | "APPROVED" | "EXECUTING" | "MODIFIED";
  commanderNotes?: string;
}

export interface EmergencyScenario {
  id: string;
  title: string;
  incidentType: string;
  severity: "CRITICAL" | "HIGH";
  location: string;
  coordinates: { lat: number; lon: number };
  affectedCount: number;
  nearestMedicalTeam: {
    name: string;
    distanceKm: number;
    etaMins: number;
  };
  availableVehicle: {
    name: string;
    code: string;
    status: string;
    fuelPct: number;
  };
  weatherCondition: string;
  commStatus: "Intermittent" | "Critical Offline";
  activeAiPlan: AiEmergencyResponsePlan;
}

export interface ResourceTwin {
  id: string;
  name: string;
  category: "LIFE_SUPPORT" | "ENERGY" | "CRITICAL_COMMS" | "LOGISTICS";
  iconName: "Fuel" | "Utensils" | "Droplets" | "Wind" | "HeartPulse" | "Zap" | "Radio" | "Microscope" | "Truck";
  currentLevelPct: number;
  consumptionRate: string;
  predictedDepletionDays: number;
  requiredReserveDays: number;
  status: "NOMINAL" | "ATTENTION" | "CRITICAL";
  totalQuantity: string;
  location: string;
  resupplyStatus: string;
  historySparkline: number[];
}

export interface WeatherImpactItem {
  id: string;
  zone: string;
  condition: string;
  tempC: number;
  windSpeedKmh: number;
  visibilityKm: number;
  operationalImpacts: {
    cargoRoutes: Array<{ routeName: string; risk: "NOMINAL" | "MODERATE" | "HIGH RISK" }>;
    personnelMovement: "UNRESTRICTED" | "RESTRICTED" | "STANDBY_SHELTER" | "FULL_HALT";
    vesselArrival: string;
    fieldCampAlert: string;
  };
  directive: string;
}

export interface CommanderMorningBrief {
  date: string;
  headline: string;
  summaryBadges: {
    stableOps: number;
    inventoryConcerns: number;
    cargoDelays: number;
    weatherRisks: number;
  };
  topPriority: {
    title: string;
    description: string;
    timeHorizon: string;
    severity: "CRITICAL" | "HIGH";
  };
  recommendedAction: {
    directive: string;
    impact: string;
    targetTab: string;
  };
  audioBriefingScript: string;
}

export interface MissionStage {
  id: string;
  order: number;
  title: string;
  stageName:
    | "MISSION_PREPARATION"
    | "CARGO_LOADING"
    | "DEPARTURE"
    | "POLAR_TRANSIT"
    | "STATION_ARRIVAL"
    | "RESEARCH_OPERATIONS"
    | "RESUPPLY"
    | "PERSONNEL_ROTATION"
    | "RETURN";
  status: "COMPLETED" | "CURRENT" | "UPCOMING";
  timeframe: string;
  keyMilestones: string[];
  activePersonnelCount: number;
  cargoVolumeTons: number;
  logisticsReadinessPct: number;
  operationalNotes: string;
}

// ======================== ENHANCED MODULE TYPES ========================

export type UserRole = "ADMIN" | "OFFICER" | "CITIZEN";
export type AppTheme = "DARK" | "PASTEL_LIGHT";

// Dashboard Charts Data Types
export interface HazardFrequencyPoint {
  month: string;
  blizzardCount: number;
  crevasseEvent: number;
  meltInundation: number;
  extremeWindHours: number;
}

export interface ResourceAllocationPoint {
  sector: string;
  fuelLitersK: number;
  rationsDays: number;
  medicalKits: number;
  powerKwh: number;
  safeCapacityPeople: number;
}

export interface PopulationVulnerabilityPoint {
  category: string;
  count: number;
  percentage: number;
  riskLevel: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  color: string;
}

// 3D GIS & Terrain Simulation Types
export interface DemTerrainPoint {
  x: number;
  y: number;
  elevationM: number;
  slopeDeg: number;
  inundationLevelM: number;
  vulnerabilityScore: number;
  hazardZone: "SAFE" | "WATCH" | "FLOOD_PRONE" | "EXTREME_AVALANCHE";
}

export interface GisFeatureLayer {
  id: string;
  name: string;
  type: "RAINFALL_RADAR" | "INUNDATION_ZONE" | "EVACUATION_ROUTE" | "SHELTER_SAFE_SITE" | "VULNERABILITY_HEATMAP";
  enabled: boolean;
  opacity: number;
  iconName?: string;
  color: string;
}

export interface SafeShelterSite {
  id: string;
  name: string;
  lat: number;
  lng: number;
  elevationM: number;
  maxCapacity: number;
  currentOccupancy: number;
  potableWaterLiters: number;
  rationsDays: number;
  powerKw: number;
  medicalBeds: number;
  status: "OPERATIONAL" | "NEAR_CAPACITY" | "FULL" | "ISOLATED";
  contactOfficer: string;
}

export interface EvacuationRoutePath {
  id: string;
  name: string;
  type: "PRIMARY" | "SECONDARY_RESCUE" | "AIR_EXTRACTION";
  lengthKm: number;
  estimatedTransitMin: number;
  elevationGainM: number;
  passabilityStatus: "CLEAR" | "CAUTION" | "INUNDATED_BLOCKED";
  waypoints: Array<{ lat: number; lng: number; label: string; elevationM: number }>;
}

// Incident & Citizen Module Types
export interface CitizenIncidentReport {
  id: string;
  timestamp: string;
  reporterName: string;
  reporterContact: string;
  reporterRole: "CITIZEN" | "FIELD_SCOUT" | "EXPEDITION_CREW";
  category: "FLOOD_MELT_INUNDATION" | "CREVASSE_FRACTURE" | "LANDSLIDE_AVALANCHE" | "EQUIPMENT_FAIL" | "MEDICAL_SOS" | "SUPPLY_CUTOFF";
  severity: "LOW" | "MODERATE" | "SEVERE" | "CRITICAL_SOS";
  latitude: number;
  longitude: number;
  locationName: string;
  notes: string;
  photoUrl?: string;
  photoExif?: {
    cameraModel: string;
    isoTimestamp: string;
    gpsAccuracyMeters: number;
    altitudeM: number;
  };
  status: "PENDING_TRIAGE" | "VERIFIED_DISPATCHED" | "RESOLVED" | "REJECTED";
  assignedUnit?: string;
  verificationNotes?: string;
  offlineQueued?: boolean;
}

export interface BroadcastAlert {
  id: string;
  timestamp: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  severity: "ADVISORY" | "WARNING" | "EMERGENCY_EVACUATE";
  channels: Array<"SMS" | "WHATSAPP" | "CELL_BROADCAST" | "IRIDIUM_SATELLITE">;
  targetSectors: string[];
  recipientCount: number;
  deliverySuccessPct: number;
  senderName: string;
}

export interface CitizenFeedbackEntry {
  id: string;
  timestamp: string;
  citizenName: string;
  sector: string;
  category: "WATER_RATIONS" | "SHELTER_HYGIENE" | "MEDICAL_NEED" | "ROAD_STATUS" | "GENERAL";
  rating: number; // 1-5
  comment: string;
  urgency: "NORMAL" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "ADDRESSED";
  resolutionNotes?: string;
}

// Analytics & Prioritization Engine Types
export interface WardRelocationRanking {
  id: string;
  wardName: string;
  sectorCode: string;
  population: number;
  vulnerableDemographics: number; // elderly, infants, injured
  hazardExposureScore: number; // 0-100
  terrainSlopeDeg: number;
  floodMeltDepthM: number;
  roadCutoffRiskPct: number;
  criticalInfraProximityScore: number; // 0-100
  calculatedPriorityScore: number; // 0-100
  priorityTier: "TIER_1_URGENT_EVAC" | "TIER_2_HIGH_VIGILANCE" | "TIER_3_MONITORING";
  designatedSafeShelter: string;
  transitRouteId: string;
}

export interface CarryingCapacityResult {
  shelterId: string;
  shelterName: string;
  existingOccupants: number;
  incomingEvacuees: number;
  totalLoad: number;
  maxBedCapacity: number;
  spacePerPersonSqM: number;
  waterAutonomyDays: number;
  foodAutonomyDays: number;
  powerAutonomyHours: number;
  medicalBedOccupancyPct: number;
  deficitAlerts: string[];
  overallSurvivalSafetyMarginPct: number;
  recommendedResupplyPackage: string[];
}

export interface MLHazardForecast {
  sector: string;
  leadTimeHours: number;
  predictedHazardType: "FLASH_FLOOD_MELT" | "CAT_4_BLIZZARD" | "ICE_SHELF_CALVING" | "CREVASSE_EXPANSION";
  probabilityPct: number;
  confidenceScorePct: number;
  anomalyDetected: boolean;
  historicalBaselineVariancePct: number;
  projectedPeakTime: string;
  recommendedAction: string;
  riskTrajectory: Array<{ hourOffset: number; riskIndex: number; lowerBound: number; upperBound: number }>;
}

export interface PolicyBriefDocument {
  id: string;
  generatedAt: string;
  title: string;
  targetAuthority: string;
  executiveSummary: string;
  keyMetrics: {
    totalExposedPopulation: number;
    highRiskWardsCount: number;
    activeCriticalIncidents: number;
    resourceReadinessPct: number;
    safeShelterSurplusDeficit: string;
  };
  priorityRelocationDirectives: Array<{
    rank: number;
    wardName: string;
    actionRequired: string;
    assignedShelter: string;
  }>;
  supplyDeficitsIdentified: string[];
  ndmaMadridComplianceCertified: boolean;
  cryptographicSeal: string;
  authorizedSignatory: string;
}

// System Audit Trail & Offline Queue
export interface AuditTrailLog {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  module: string;
  details: string;
  sha256Hash: string;
  tamperVerified: boolean;
}

export interface OfflineSyncQueueItem {
  id: string;
  queuedAt?: string;
  timestamp?: string;
  type?: "INCIDENT_REPORT" | "FEEDBACK_SUBMISSION" | "SHELTER_UPDATE" | "ALERT_BROADCAST" | "PERSONNEL_CHECKIN" | "SOS_BEACON" | "CARGO_SCAN";
  actionType?: "PERSONNEL_CHECKIN" | "SOS_BEACON" | "CARGO_SCAN" | "INCIDENT_REPORT" | "FEEDBACK_SUBMISSION" | "SHELTER_UPDATE" | "ALERT_BROADCAST";
  payload: any;
  priority?: number;
  retryCount?: number;
  synced: boolean;
}



