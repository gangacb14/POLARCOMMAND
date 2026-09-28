import React from "react";
import { useTranslation } from "../i18n";
import {
  LayoutDashboard,
  Compass,
  Boxes,
  Users,
  Mountain,
  Navigation,
  Sparkles,
  ShieldAlert,
  Bell,
  PlayCircle,
  Scan,
} from "lucide-react";

export type ParentModuleId =
  | "mission-control"
  | "expedition-mgmt"
  | "logistics-assets"
  | "personnel-safety"
  | "gis-disaster"
  | "expedition-intelligence"
  | "simulation-ai"
  | "emergency-response";

export type SubModuleId =
  // Mission Control
  | "overview"
  | "digital-twin"
  | "reports"
  // Expedition Management
  | "timeline"
  | "planner"
  | "telemetry"
  // Logistics & Assets
  | "cargo"
  | "inventory"
  | "resources"
  | "smart-resupply"
  // Personnel & Safety
  | "personnel-twin"
  | "personnel-roster"
  // 3D GIS & Disaster
  | "disaster-dashboard"
  | "gis-3d-dem"
  | "citizen-incident"
  | "analytics-wow"
  // Expedition Intelligence
  | "route-intel"
  | "weather-impact"
  // Simulation & AI
  | "simulator"
  | "ai-copilot"
  // Emergency Response
  | "emergency-command"
  | "incident-sos";

// Legacy CommandTab union for full compatibility across existing components
export type CommandTab =
  | ParentModuleId
  | SubModuleId
  | "mobile-pwa"
  | "analytics"
  | "expeditions"
  | "cargo-passport"
  | "resource-intelligence"
  | "personnel"
  | "route-intelligence";

interface CommandNavProps {
  activeParentModule: ParentModuleId;
  onSelectParentModule: (module: ParentModuleId) => void;
  isEmergencyActive: boolean;
  onOpenMorningBrief: () => void;
  onOpenStoryDemo: () => void;
  onOpenScanQr: () => void;
}

export const CommandNav: React.FC<CommandNavProps> = ({
  activeParentModule,
  onSelectParentModule,
  isEmergencyActive,
  onOpenMorningBrief,
  onOpenStoryDemo,
  onOpenScanQr,
}) => {
  const { t, language } = useTranslation();

  // 8 High-Level Parent Modules
  const parentModules = [
    {
      id: "mission-control" as ParentModuleId,
      label: language === "hi" ? "मुख्यालय कमान" : "MISSION CONTROL",
      icon: LayoutDashboard,
      badge: language === "hi" ? "मुख्यालय" : "HQ",
    },
    {
      id: "expedition-mgmt" as ParentModuleId,
      label: language === "hi" ? "अभियान प्रबंधन" : "EXPEDITION MANAGEMENT",
      icon: Compass,
      badge: language === "hi" ? "योजना" : "PLAN",
    },
    {
      id: "logistics-assets" as ParentModuleId,
      label: language === "hi" ? "रसद एवं परिसंपत्ति" : "LOGISTICS & ASSETS",
      icon: Boxes,
      badge: language === "hi" ? "आपूर्ति" : "SUPPLY",
    },
    {
      id: "personnel-safety" as ParentModuleId,
      label: language === "hi" ? "कार्मिक एवं सुरक्षा" : "PERSONNEL & SAFETY",
      icon: Users,
      badge: language === "hi" ? "सुरक्षा" : "SAFETY",
    },
    {
      id: "gis-disaster" as ParentModuleId,
      label: language === "hi" ? "3D GIS / आपदा" : "3D GIS / DISASTER",
      icon: Mountain,
      badge: "3D DEM",
    },
    {
      id: "expedition-intelligence" as ParentModuleId,
      label: language === "hi" ? "अभियान इंटेलिजेंस" : "EXPEDITION INTELLIGENCE",
      icon: Navigation,
      badge: language === "hi" ? "मार्ग" : "INTEL",
    },
    {
      id: "simulation-ai" as ParentModuleId,
      label: language === "hi" ? "सिमुलेशन एवं एआई" : "SIMULATION & AI",
      icon: Sparkles,
      badge: language === "hi" ? "लाइव" : "AI",
      pulse: true,
    },
    {
      id: "emergency-response" as ParentModuleId,
      label: language === "hi" ? "आपातकालीन प्रतिक्रिया" : "EMERGENCY RESPONSE",
      icon: ShieldAlert,
      isEmergency: true,
      badge: "SOS",
    },
  ];

  return (
    <div className="space-y-2">
      {/* Top Utility Bar: Guided Story Demo, 60-Sec Brief, Emergency Banner, QR Scan */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-1 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Guided Story Demo Button */}
          <button
            onClick={onOpenStoryDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 font-mono font-bold transition shadow-sm animate-pulse"
            title="Launch step-by-step interactive 15-step demonstration story"
          >
            <PlayCircle className="w-4 h-4 text-cyan-400" />
            <span>{t("15-STEP STORY DEMO")}</span>
          </button>

          {/* Commander's 60-Second Morning Brief */}
          <button
            onClick={onOpenMorningBrief}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 font-mono font-bold transition shadow-xs"
            title="Open Commander's 60-Second Expedition Morning Briefing"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>{t("60-SEC MORNING BRIEF")}</span>
          </button>

          {/* Emergency Alert Indicator */}
          {isEmergencyActive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950 text-red-200 border border-red-500/80 font-mono font-bold animate-pulse">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>{language === "hi" ? "आपातकाल सक्रिय: फील्ड कैंप 03" : "EMERGENCY ACTIVE: FIELD CAMP 03"}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Scan Cargo QR */}
          <button
            onClick={onOpenScanQr}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono font-semibold transition"
            title="Simulate scanning container QR code"
          >
            <Scan className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t("Quick QR Scan")}</span>
          </button>
        </div>
      </div>

      {/* Level 1: Clean Primary Polar Command Navigation Bar (7–8 High-Level Modules) */}
      <div className="flex items-center border-b border-slate-800 pb-1.5 overflow-x-auto gap-1.5 scrollbar-thin">
        {parentModules.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeParentModule === mod.id;

          if (mod.isEmergency) {
            return (
              <button
                key={mod.id}
                onClick={() => onSelectParentModule(mod.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold rounded-lg transition whitespace-nowrap ${
                  isEmergencyActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-950 animate-pulse border border-red-400"
                    : isActive
                    ? "bg-red-950 text-red-200 border border-red-500 shadow-md shadow-red-950"
                    : "text-red-400 hover:bg-red-950/50 hover:text-red-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{mod.label}</span>
                {isEmergencyActive ? (
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                ) : (
                  mod.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-red-900/80 text-red-200 border border-red-700 font-mono">
                      {mod.badge}
                    </span>
                  )
                )}
              </button>
            );
          }

          return (
            <button
              key={mod.id}
              onClick={() => onSelectParentModule(mod.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold rounded-lg transition whitespace-nowrap ${
                isActive
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-950 border border-cyan-400/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/90 border border-transparent"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-white" : "text-slate-400"
                }`}
              />
              <span>{mod.label}</span>
              {mod.pulse && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
              )}
              {mod.badge && !isActive && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                  {mod.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
