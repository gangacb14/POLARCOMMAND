import React, { useState } from "react";
import { MOCK_EMERGENCY_SCENARIO } from "../data/mockPolarData";
import { EmergencyScenario, AiEmergencyResponsePlan } from "../types";
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  Radio,
  Truck,
  HeartPulse,
  Wind,
  Navigation,
  Clock,
  CheckCircle2,
  Check,
  Edit3,
  Send,
  Sparkles,
  MapPin,
  RefreshCw,
  Eye,
  Sliders,
  Flame,
  Volume2,
} from "lucide-react";

interface EmergencyCommandViewProps {
  onPlanApproved?: (plan: AiEmergencyResponsePlan) => void;
  onNavigateToReport?: () => void;
}

export const EmergencyCommandView: React.FC<EmergencyCommandViewProps> = ({
  onPlanApproved,
  onNavigateToReport,
}) => {
  const [scenario, setScenario] = useState<EmergencyScenario>(MOCK_EMERGENCY_SCENARIO);
  const [planState, setPlanState] = useState<"GENERATED" | "APPROVED" | "EXECUTING" | "RESOLVED">("GENERATED");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [commanderNotes, setCommanderNotes] = useState(scenario.activeAiPlan.commanderNotes || "");
  const [executionSecondsLeft, setExecutionSecondsLeft] = useState(42 * 60);

  const plan = scenario.activeAiPlan;

  const handleApprovePlan = () => {
    setPlanState("APPROVED");
    if (onPlanApproved) {
      onPlanApproved({
        ...plan,
        status: "APPROVED",
        commanderNotes,
      });
    }

    // Auto-advance into execution simulation
    setTimeout(() => {
      setPlanState("EXECUTING");
    }, 1200);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* FULL RED EMERGENCY COMMAND STROBE BANNER */}
      <div className="bg-red-950/90 border-2 border-red-500 rounded-xl p-4 sm:p-5 shadow-[0_0_40px_rgba(239,68,68,0.3)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-red-600/30 border-2 border-red-500 flex items-center justify-center text-red-400 animate-pulse">
            <AlertOctagon className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white tracking-widest animate-pulse">
                CRITICAL DEFCON 1 ALERT
              </span>
              <span className="text-xs font-mono text-red-300">
                INCIDENT ID: {scenario.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white mt-1">
              {scenario.title}
            </h1>
            <p className="text-xs text-red-200 font-sans mt-0.5">
              Type: <strong>{scenario.incidentType}</strong> • Location: <strong>{scenario.location}</strong>
            </p>
          </div>
        </div>

        {/* Emergency Telemetry Counters */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-2">
            <span className="text-slate-300 block text-[10px]">Affected Personnel</span>
            <span className="text-lg font-black text-white">{scenario.affectedCount} Souls</span>
          </div>

          <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-2">
            <span className="text-slate-300 block text-[10px]">Nearest Med Team</span>
            <span className="text-lg font-black text-amber-300">{scenario.nearestMedicalTeam.distanceKm} km</span>
          </div>

          <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-2">
            <span className="text-slate-300 block text-[10px]">Available Vehicle</span>
            <span className="text-lg font-black text-emerald-300">{scenario.availableVehicle.code} (1)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Tactical Incident Digital Twin Map + AI Response Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Tactical Incident Map (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1220] border border-red-500/40 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>Tactical Polar Incident Map</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Corridor Scale: 1:25,000
            </span>
          </div>

          {/* SVG Tactical Vector Map */}
          <div className="relative w-full h-80 rounded-lg bg-[#050b14] border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Grid Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <defs>
                <pattern id="tactical-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tactical-grid)" />
            </svg>

            {/* Tactical Route Lines & Hazard Zones */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Crevasse Danger Zone (Hazard Red Fill) */}
              <polygon
                points="160,110 240,90 270,160 190,180"
                fill="rgba(239, 68, 68, 0.15)"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="180" y="140" fill="#f87171" fontSize="9" fontFamily="monospace">
                UNSTABLE CREVASSE FIELD
              </text>

              {/* Unsafe Direct Route A (Struck out) */}
              <line
                x1="80"
                y1="220"
                x2="320"
                y2="120"
                stroke="#dc2626"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.6"
              />

              {/* Recommended Safe Route B (Glowing Green Traverse) */}
              <path
                d="M 80 220 Q 140 270 240 230 T 320 120"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="6 3"
                className="animate-pulse"
              />
              <text x="160" y="275" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">
                SAFE ROUTE B (CLEARED) → 18.4 km
              </text>

              {/* Base / Origin: Maitri Operations Hangar */}
              <g transform="translate(80, 220)">
                <circle r="12" fill="#0284c7" fillOpacity="0.4" />
                <circle r="6" fill="#0284c7" />
                <text x="-40" y="-12" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  MAITRI BASE (TEAM BRAVO)
                </text>
              </g>

              {/* Active Vehicle V-04 on Route B */}
              <g transform="translate(200, 245)">
                <circle r="8" fill="#10b981" fillOpacity="0.5" className="animate-ping" />
                <rect x="-6" y="-6" width="12" height="12" fill="#10b981" rx="2" />
                <text x="-18" y="18" fill="#a7f3d0" fontSize="9" fontFamily="monospace">
                  SNOWCAT V-04
                </text>
              </g>

              {/* Destination: Field Camp 03 (Pulsing Red Emergency Beacon) */}
              <g transform="translate(320, 120)">
                <circle r="22" fill="#ef4444" fillOpacity="0.3" className="animate-ping" />
                <circle r="12" fill="#ef4444" fillOpacity="0.6" />
                <circle r="6" fill="#f87171" />
                <text x="-45" y="-18" fill="#fca5a5" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  SOS: FIELD CAMP 03
                </text>
              </g>
            </svg>
          </div>

          {/* Map Legend */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-1 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span>Incident Beacon: Field Camp 03</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Response: Team Bravo (18.4 km)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-400" />
              <span>Route B: Ground Radar Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-red-500 dashed" />
              <span>Route A: Crevasse Hazard (Blocked)</span>
            </div>
          </div>

          {/* Weather & Comm Live Conditions */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1 text-red-400 font-mono">
                <Wind className="w-3.5 h-3.5" />
                Weather Condition:
              </span>
              <span className="text-red-300 font-mono font-bold">Katabatic 62 km/h</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1 text-amber-400 font-mono">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Communication Telemetry:
              </span>
              <span className="text-amber-300 font-mono font-bold">{scenario.commStatus}</span>
            </div>
          </div>
        </div>

        {/* Right: AI EMERGENCY RESPONSE PLANNER (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1220] border border-cyan-500/40 rounded-xl p-4 sm:p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-mono text-white tracking-tight">
                    AI Emergency Response Planner
                  </h3>
                  <span className="text-xs text-cyan-300 font-mono">
                    AUTONOMOUS RESCUE DISPATCH SYNTHESIS
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                  planState === "APPROVED" || planState === "EXECUTING"
                    ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                    : "bg-amber-950 text-amber-300 border-amber-500/50"
                }`}
              >
                {planState === "EXECUTING" ? "MISSION IN EXECUTION" : `PLAN: ${planState}`}
              </span>
            </div>

            {/* Headline */}
            <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
              <h4 className="text-xs font-mono font-bold text-cyan-300 mb-1">
                {plan.headline}
              </h4>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span>ETA: <strong className="text-emerald-400">{plan.estimatedResponseTimeMins} Minutes</strong></span>
                <span>•</span>
                <span>Team: <strong className="text-white">{plan.deployedTeam}</strong></span>
                <span>•</span>
                <span>Vehicle: <strong className="text-white">{plan.assignedVehicle}</strong></span>
              </div>
            </div>

            {/* Procedural Rescue Steps */}
            <div className="mt-3 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                Calculated Rescue Directives:
              </span>
              <div className="space-y-1.5">
                {plan.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-start gap-2.5 ${
                      planState === "EXECUTING" && idx === activeStepIndex
                        ? "bg-cyan-950/80 border-cyan-400 text-white shadow-sm"
                        : "bg-slate-950/70 border-slate-800 text-slate-200"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] shrink-0 font-bold">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Required Checklist */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2">
                Mandatory Mission Payload Checklist:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.resourcesRequired.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-slate-200">{res.name}</span>
                    </div>
                    <span className="text-[11px] text-cyan-400">{res.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Commander Notes / Override */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Commander Orders & Modifiers
                </span>
                <button
                  onClick={() => setIsEditingNotes(!isEditingNotes)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingNotes ? "Lock Notes" : "Modify Plan Directives"}</span>
                </button>
              </div>

              {isEditingNotes ? (
                <textarea
                  value={commanderNotes}
                  onChange={(e) => setCommanderNotes(e.target.value)}
                  placeholder="Enter specific commander operational directives or alternative vehicle orders..."
                  className="w-full bg-slate-950 border border-cyan-500/50 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
                  rows={2}
                />
              ) : (
                <p className="text-xs text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/80 font-mono italic">
                  “{commanderNotes || "Standard AI Response Plan authorized with zero alterations."}”
                </p>
              )}
            </div>
          </div>

          {/* Action Footer: APPROVE PLAN or MODIFY PLAN */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>
                Rescue Response Horizon: <strong className="text-white">42 Minutes</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingNotes(true)}
                className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono transition flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>MODIFY PLAN</span>
              </button>

              {planState === "GENERATED" ? (
                <button
                  onClick={handleApprovePlan}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-950"
                >
                  <Check className="w-4 h-4" />
                  <span>APPROVE & DISPATCH RESCUE TEAM</span>
                </button>
              ) : (
                <button
                  onClick={onNavigateToReport}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition shadow-lg shadow-cyan-950"
                >
                  <Navigation className="w-4 h-4" />
                  <span>GENERATE EXPEDITION REPORT</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
