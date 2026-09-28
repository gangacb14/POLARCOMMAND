import React from "react";
import { useTranslation } from "../i18n";
import {
  LayoutDashboard,
  Globe2,
  FileText,
  Compass,
  Clock,
  Navigation,
  Boxes,
  Scan,
  BarChart3,
  Truck,
  Users,
  HeartPulse,
  Activity,
  Mountain,
  AlertTriangle,
  BrainCircuit,
  CloudLightning,
  Sliders,
  Sparkles,
  ShieldAlert,
  AlertOctagon,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkle
} from "lucide-react";
import { ParentModuleId, SubModuleId } from "./CommandNav";

export interface SubModuleItem {
  id: SubModuleId;
  label: string;
  labelHi: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  desc: string;
  descHi: string;
  isDanger?: boolean;
}

export interface ParentModuleConfig {
  id: ParentModuleId;
  title: string;
  titleHi: string;
  category: string;
  categoryHi: string;
  icon: React.ComponentType<{ className?: string }>;
  isEmergency?: boolean;
  subModules: SubModuleItem[];
}

export const MODULE_CONFIGS: Record<ParentModuleId, ParentModuleConfig> = {
  "mission-control": {
    id: "mission-control",
    title: "MISSION CONTROL",
    titleHi: "मुख्यालय कमान",
    category: "COMMAND & TELEMETRY",
    categoryHi: "कमान एवं टेलीमेट्री",
    icon: LayoutDashboard,
    subModules: [
      {
        id: "overview",
        label: "HQ Operations Overview",
        labelHi: "मुख्यालय संचालन अवलोकन",
        icon: LayoutDashboard,
        badge: "HQ",
        desc: "Live station matrix & telemetry pulse",
        descHi: "लाइव स्टेशन मैट्रिक्स एवं टेलीमेट्री",
      },
      {
        id: "digital-twin",
        label: "Base Digital Twin",
        labelHi: "बेस डिजिटल ट्विन",
        icon: Globe2,
        badge: "2D/3D",
        desc: "Interactive polar stations & ice shelf",
        descHi: "इंटरैक्टिव ध्रुवीय स्टेशन एवं बर्फ शेल्फ",
      },
      {
        id: "reports",
        label: "Mission Reports & Sitrep",
        labelHi: "मिशन रिपोर्ट एवं सिटरैप",
        icon: FileText,
        badge: "DOCS",
        desc: "Madrid Protocol & regulatory dossiers",
        descHi: "मैड्रिड प्रोटोकॉल एवं विनियामक डोजियर",
      },
    ],
  },
  "expedition-mgmt": {
    id: "expedition-mgmt",
    title: "EXPEDITION MANAGEMENT",
    titleHi: "अभियान प्रबंधन",
    category: "TRAVERSES & TIMELINES",
    categoryHi: "मार्ग एवं समयरेखा",
    icon: Compass,
    subModules: [
      {
        id: "timeline",
        label: "Lifecycle Timeline",
        labelHi: "जीवनचक्र समयरेखा",
        icon: Clock,
        badge: "ACTIVE",
        desc: "Expedition milestones & phase tracking",
        descHi: "अभियान मील के पत्थर एवं चरण ट्रैकिंग",
      },
      {
        id: "planner",
        label: "Traverse Route Planner",
        labelHi: "मार्ग योजनाकार",
        icon: Compass,
        badge: "WAYPOINTS",
        desc: "Plan traverse, fuel & environmental permits",
        descHi: "मार्ग, ईंधन और पर्यावरण मंजूरी योजना",
      },
      {
        id: "telemetry",
        label: "Field Trajectory & Telemetry",
        labelHi: "फील्ड टेलीमेट्री एवं पथ",
        icon: Navigation,
        badge: "GIS",
        desc: "Real-time convoy tracking & speed history",
        descHi: "वास्तविक समय काफिला ट्रैकिंग व गति इतिहास",
      },
    ],
  },
  "logistics-assets": {
    id: "logistics-assets",
    title: "LOGISTICS & ASSETS",
    titleHi: "रसद एवं परिसंपत्ति",
    category: "SUPPLY CHAIN & ASSETS",
    categoryHi: "आपूर्ति श्रृंखला एवं संपत्तियां",
    icon: Boxes,
    subModules: [
      {
        id: "cargo",
        label: "Cargo Tracking & Passport",
        labelHi: "कार्गो ट्रैकिंग एवं पासपोर्ट",
        icon: Scan,
        badge: "RFID/QR",
        desc: "Cold-chain verification & tamper seals",
        descHi: "कोल्ड-चेन सत्यापन एवं छेड़छाड़ सील",
      },
      {
        id: "inventory",
        label: "Consumables & Inventory",
        labelHi: "उपभोग्य वस्तुएं एवं इन्वेंटरी",
        icon: BarChart3,
        badge: "DEPOT",
        desc: "Rations, spares & automated reorders",
        descHi: "राशन, स्पेयर पार्ट्स और पुनः ऑर्डर",
      },
      {
        id: "resources",
        label: "Resource Digital Twins",
        labelHi: "संसाधन डिजिटल ट्विन्स",
        icon: Boxes,
        badge: "9 TWINS",
        desc: "Fuel, water, power & waste telemetry",
        descHi: "ईंधन, पानी, ऊर्जा एवं अपशिष्ट टेलीमेट्री",
      },
      {
        id: "smart-resupply",
        label: "Smart Resupply Engine",
        labelHi: "स्मार्ट पुनःआपूर्ति इंजन",
        icon: Truck,
        badge: "AI-AUTO",
        desc: "Multi-modal resupply planning & logistics",
        descHi: "मल्टी-मॉडल पुनःआपूर्ति योजना व रसद",
      },
    ],
  },
  "personnel-safety": {
    id: "personnel-safety",
    title: "PERSONNEL & SAFETY",
    titleHi: "कार्मिक एवं सुरक्षा",
    category: "CREW & MEDICAL",
    categoryHi: "दल एवं चिकित्सा",
    icon: Users,
    subModules: [
      {
        id: "personnel-twin",
        label: "Personnel Digital Twin",
        labelHi: "कार्मिक डिजिटल ट्विन",
        icon: HeartPulse,
        badge: "VITALS",
        desc: "Biometric vitals, suit status & risk index",
        descHi: "बायोमेट्रिक संकेत, सूट स्थिति व जोखिम",
      },
      {
        id: "personnel-roster",
        label: "Crew Roster & Check-ins",
        labelHi: "दल रोस्टर एवं चेक-इन",
        icon: Users,
        badge: "AES-256",
        desc: "Field check-ins & encrypted medical clearance",
        descHi: "फ़ील्ड चेक-इन और एन्क्रिप्टेड मेडिकल रिकॉर्ड",
      },
    ],
  },
  "gis-disaster": {
    id: "gis-disaster",
    title: "3D GIS / DISASTER",
    titleHi: "3D जीआईएस एवं आपदा",
    category: "MULTI-HAZARD & TERRAIN",
    categoryHi: "बहु-खतरा एवं भूभाग",
    icon: Mountain,
    subModules: [
      {
        id: "disaster-dashboard",
        label: "Disaster Dashboard",
        labelHi: "आपदा डैशबोर्ड",
        icon: Activity,
        badge: "EARLY WARN",
        desc: "Multi-hazard early warning & risk scores",
        descHi: "बहु-खतरा पूर्व चेतावनी व जोखिम स्कोर",
      },
      {
        id: "gis-3d-dem",
        label: "3D GIS & Elevation DEM",
        labelHi: "3D जीआईएस एवं भूभाग",
        icon: Mountain,
        badge: "3D MESH",
        desc: "Glacier elevation & satellite terrain mesh",
        descHi: "ग्लेशियर ऊंचाई और उपग्रह स्थलाकृति",
      },
      {
        id: "citizen-incident",
        label: "Citizen & SMS SOS Triage",
        labelHi: "नागरिक रिपोर्ट एवं एसएमएस",
        icon: AlertTriangle,
        badge: "SMS/GPS",
        desc: "Crowdsourced incident log & SMS gateway",
        descHi: "घटना रिपोर्ट व एसएमएस गेटवे",
      },
      {
        id: "analytics-wow",
        label: "MCDA Decision Matrix",
        labelHi: "एमसीडीए निर्णय मैट्रिक्स",
        icon: BrainCircuit,
        badge: "DECISION",
        desc: "Multi-criteria evacuation & route scoring",
        descHi: "बहु-मानदंड निकासी व मार्ग विश्लेषण",
      },
    ],
  },
  "expedition-intelligence": {
    id: "expedition-intelligence",
    title: "EXPEDITION INTELLIGENCE",
    titleHi: "अभियान इंटेलिजेंस",
    category: "INTELLIGENCE & HAZARDS",
    categoryHi: "इंटेलिजेंस एवं खतरे",
    icon: Navigation,
    subModules: [
      {
        id: "route-intel",
        label: "Route Intel",
        labelHi: "मार्ग इंटेलिजेंस",
        icon: Navigation,
        badge: "RADAR",
        desc: "Crevasse danger zones & safe corridors",
        descHi: "दरार खतरा क्षेत्र और सुरक्षित मार्ग",
      },
      {
        id: "weather-impact",
        label: "Weather Impact Engine",
        labelHi: "मौसम प्रभाव इंजन",
        icon: CloudLightning,
        badge: "WMO FEED",
        desc: "Blizzard & sea-ice compaction modeling",
        descHi: "बर्फ़ीला तूफ़ान और समुद्री बर्फ संघनन",
      },
    ],
  },
  "simulation-ai": {
    id: "simulation-ai",
    title: "SIMULATION & AI",
    titleHi: "सिमुलेशन एवं एआई",
    category: "PREDICTIVE & NEURAL",
    categoryHi: "पूर्वानुमान एवं न्यूरल",
    icon: Sparkles,
    subModules: [
      {
        id: "simulator",
        label: "Simulator",
        labelHi: "सिमुलेटर",
        icon: Sliders,
        badge: "WHAT-IF",
        desc: "Polar storm & breakdown contingency simulator",
        descHi: "ध्रुवीय तूफ़ान व खराबी आकस्मिक सिमुलेशन",
      },
      {
        id: "ai-copilot",
        label: "AI Copilot",
        labelHi: "एआई कोपायलट",
        icon: Sparkles,
        badge: "LIVE",
        desc: "Neural assistant & predictive advisory",
        descHi: "न्यूरल सहायक एवं पूर्वानुमान सलाहकार",
      },
    ],
  },
  "emergency-response": {
    id: "emergency-response",
    title: "EMERGENCY RESPONSE",
    titleHi: "आपातकालीन प्रतिक्रिया",
    category: "CRISIS COMMAND",
    categoryHi: "संकट कमान",
    icon: ShieldAlert,
    isEmergency: true,
    subModules: [
      {
        id: "emergency-command",
        label: "Emergency Command Room",
        labelHi: "आपातकालीन कमान कक्ष",
        icon: ShieldAlert,
        badge: "SAR ROOM",
        desc: "Incident escalation matrix & rescue dispatch",
        descHi: "घटना वृद्धि मैट्रिक्स व बचाव प्रेषण",
        isDanger: true,
      },
      {
        id: "incident-sos",
        label: "Incident SOS Dispatcher",
        labelHi: "एसओएस प्रेषक डेस्क",
        icon: AlertOctagon,
        badge: "DISTRESS",
        desc: "Direct satellite distress & event logging",
        descHi: "प्रत्यक्ष उपग्रह संकट व घटना लॉगिंग",
        isDanger: true,
      },
    ],
  },
};

interface SecondaryModulePanelProps {
  parentModule: ParentModuleId;
  activeSubModule: SubModuleId;
  onSelectSubModule: (subId: SubModuleId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isEmergencyActive?: boolean;
}

export const SecondaryModulePanel: React.FC<SecondaryModulePanelProps> = ({
  parentModule,
  activeSubModule,
  onSelectSubModule,
  isCollapsed,
  onToggleCollapse,
  isEmergencyActive,
}) => {
  const { language } = useTranslation();
  const config = MODULE_CONFIGS[parentModule] || MODULE_CONFIGS["mission-control"];
  const ParentIcon = config.icon;

  const title = language === "hi" ? config.titleHi : config.title;
  const category = language === "hi" ? config.categoryHi : config.category;

  return (
    <div
      className={`transition-all duration-200 border rounded-xl shadow-lg shrink-0 ${
        config.isEmergency
          ? "bg-[#140608]/95 border-red-900/60"
          : "bg-[#070e1c]/95 border-slate-800/90"
      } ${
        isCollapsed
          ? "w-full md:w-auto p-2"
          : "w-full md:w-64 lg:w-72 p-3 space-y-3"
      }`}
    >
      {/* Secondary Panel Header with Parent Title & Collapse Toggle */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 overflow-hidden">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
              config.isEmergency
                ? "bg-red-950 text-red-400 border-red-500/50"
                : "bg-cyan-950/80 text-cyan-400 border-cyan-500/40"
            }`}
          >
            <ParentIcon className="w-4 h-4" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 block truncate">
                  {category}
                </span>
                {config.isEmergency && isEmergencyActive && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                )}
              </div>
              <h2 className="text-xs font-black font-mono tracking-tight text-white uppercase truncate">
                {title}
              </h2>
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button for Desktop */}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition"
          title={isCollapsed ? (language === "hi" ? "पैनल विस्तृत करें" : "Expand Sub-Menu") : (language === "hi" ? "पैनल छोटा करें" : "Collapse Sub-Menu")}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Sub-Feature Buttons List */}
      <div
        className={`flex ${
          isCollapsed
            ? "flex-row flex-wrap md:flex-col gap-1.5"
            : "flex-col gap-1.5"
        }`}
      >
        {config.subModules.map((item) => {
          const ItemIcon = item.icon;
          const isActive = activeSubModule === item.id;
          const label = language === "hi" ? item.labelHi : item.label;
          const desc = language === "hi" ? item.descHi : item.desc;

          if (isCollapsed) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectSubModule(item.id)}
                className={`p-2 rounded-lg flex items-center justify-center transition relative group ${
                  isActive
                    ? config.isEmergency
                      ? "bg-red-600 text-white shadow-md shadow-red-950"
                      : "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`}
                title={`${label} — ${desc}`}
              >
                <ItemIcon className="w-4 h-4" />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-300 border border-slate-950 animate-pulse" />
                )}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectSubModule(item.id)}
              className={`w-full text-left p-2 rounded-lg transition border flex items-start gap-2.5 ${
                isActive
                  ? item.isDanger || config.isEmergency
                    ? "bg-red-950/90 border-red-500 text-white shadow-md shadow-red-950/40"
                    : "bg-cyan-950/70 border-cyan-500/60 text-white shadow-md shadow-cyan-950/30"
                  : "bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-900/90 hover:border-slate-700 hover:text-white"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  isActive
                    ? item.isDanger || config.isEmergency
                      ? "bg-red-600 text-white"
                      : "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                <ItemIcon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-mono font-bold truncate">
                    {label}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                        isActive
                          ? item.isDanger || config.isEmergency
                            ? "bg-red-600 text-white"
                            : "bg-cyan-400 text-black"
                          : "bg-slate-800 text-cyan-300 border border-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                  {desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Contextual Quick Info Footer (When Expanded) */}
      {!isCollapsed && (
        <div className="pt-2 border-t border-slate-800/70 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{language === "hi" ? "स्तरीय नेविगेशन" : "Two-Level Command"}</span>
          </span>
          <span className="text-slate-500">
            {config.subModules.findIndex((s) => s.id === activeSubModule) + 1} / {config.subModules.length}
          </span>
        </div>
      )}
    </div>
  );
};
