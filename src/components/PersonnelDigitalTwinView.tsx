import React, { useState } from "react";
import { MOCK_PERSONNEL_GROUPS } from "../data/mockPolarData";
import { PersonnelGroup } from "../types";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Radio,
  Clock,
  Navigation,
  MapPin,
  Wind,
  CheckCircle2,
  ChevronRight,
  Truck,
  HeartPulse,
  Flame,
  Search,
  ExternalLink,
} from "lucide-react";

interface PersonnelDigitalTwinViewProps {
  onTriggerEmergency?: (group: PersonnelGroup) => void;
}

export const PersonnelDigitalTwinView: React.FC<PersonnelDigitalTwinViewProps> = ({
  onTriggerEmergency,
}) => {
  const [groups] = useState<PersonnelGroup[]>(MOCK_PERSONNEL_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("GRP-ALPHA");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPTIMAL" | "CAUTION" | "HIGH_RISK">("ALL");

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  const filteredGroups = groups.filter((g) => {
    if (statusFilter === "ALL") return true;
    return g.safetyStatus === statusFilter;
  });

  const getSafetyBadge = (status: string) => {
    switch (status) {
      case "OPTIMAL":
        return {
          bg: "bg-emerald-950/80",
          text: "text-emerald-400",
          border: "border-emerald-500/40",
          label: "Optimal Safety",
        };
      case "CAUTION":
        return {
          bg: "bg-amber-950/80",
          text: "text-amber-400",
          border: "border-amber-500/40",
          label: "Caution Advisory",
        };
      case "HIGH_RISK":
        return {
          bg: "bg-red-950/80",
          text: "text-red-400",
          border: "border-red-500/50",
          label: "High Risk Corridor",
        };
      default:
        return {
          bg: "bg-slate-900",
          text: "text-slate-300",
          border: "border-slate-700",
          label: status,
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black font-mono tracking-tight text-white uppercase">
                Personnel Safety & Movement Digital Twin
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                5 ACTIVE EXPEDITION TEAMS (100+ PERSONNEL)
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Live biometric situational awareness, communications telemetry, weather risk horizons, and multi-stage traverse timelines.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          {(["ALL", "OPTIMAL", "CAUTION", "HIGH_RISK"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                statusFilter === filter
                  ? "bg-slate-800 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Groups List & Detailed Safety / Movement Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Personnel Groups Roster (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredGroups.map((grp) => {
            const isSelected = grp.id === selectedGroupId;
            const badge = getSafetyBadge(grp.safetyStatus);

            return (
              <div
                key={grp.id}
                onClick={() => setSelectedGroupId(grp.id)}
                className={`cursor-pointer rounded-xl p-4 transition border ${
                  isSelected
                    ? "bg-[#0f172a] border-cyan-500 shadow-lg shadow-cyan-950/40"
                    : "bg-[#0b1220] border-slate-800/80 hover:border-slate-700 hover:bg-[#0d1527]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black font-mono tracking-tight text-white">
                      {grp.name}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                      {grp.personnelCount} Personnel
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{grp.currentLocation}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Radio
                      className={`w-3.5 h-3.5 shrink-0 ${
                        grp.communicationStatus === "STABLE"
                          ? "text-emerald-400"
                          : "text-amber-400 animate-pulse"
                      }`}
                    />
                    <span className="truncate">Comm: {grp.communicationStatus}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Wind
                      className={`w-3.5 h-3.5 shrink-0 ${
                        grp.weatherRisk === "SEVERE_BLIZZARD"
                          ? "text-red-400"
                          : "text-slate-400"
                      }`}
                    />
                    <span className="truncate">Weather: {grp.weatherRisk.replace("_", " ")}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Return: {grp.returnWindowHours}h window</span>
                  </div>
                </div>

                {grp.id === "GRP-ALPHA" && (
                  <div className="mt-3 pt-2 border-t border-red-500/20 flex items-center justify-between text-[11px]">
                    <span className="text-red-400 font-mono flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3 text-red-500 animate-pulse" />
                      Pinned by Katabatic Gale (-38°C)
                    </span>
                    {onTriggerEmergency && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerEmergency(grp);
                        }}
                        className="px-2 py-0.5 rounded bg-red-950 hover:bg-red-900 border border-red-500/60 text-red-200 font-mono font-bold text-[10px] transition"
                      >
                        Simulate SOS
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Digital Twin for Selected Group (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1220] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
          {/* Header of Active Group */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-mono text-white tracking-tight">
                  {selectedGroup.name}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  [{selectedGroup.code}]
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                  Base: {selectedGroup.station}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-1">
                Leader: <strong className="text-white">{selectedGroup.leader}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                  getSafetyBadge(selectedGroup.safetyStatus).bg
                } ${getSafetyBadge(selectedGroup.safetyStatus).text} ${
                  getSafetyBadge(selectedGroup.safetyStatus).border
                }`}
              >
                {getSafetyBadge(selectedGroup.safetyStatus).label}
              </span>
            </div>
          </div>

          {/* Mission Assignment & Live Operational Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Mission Assignment
              </span>
              <p className="text-slate-200 leading-relaxed font-sans">
                {selectedGroup.missionAssignment}
              </p>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Assigned Vehicle & Transport
              </span>
              <p className="text-slate-200 font-mono">
                {selectedGroup.assignedVehicle}
              </p>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                <span>Rations: {selectedGroup.suppliesStatus.rationsDays} Days</span>
                <span>•</span>
                <span>Fuel: {selectedGroup.suppliesStatus.fuelLiters} L</span>
                <span>•</span>
                <span>Medkits: {selectedGroup.suppliesStatus.medKits}</span>
              </div>
            </div>
          </div>

          {/* Key Roles Badges */}
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
              Specialized Roles in Group
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedGroup.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* MOVEMENT TIMELINE (Base -> Vessel -> Station -> Field Camp -> Return) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                <span>Expedition Movement Timeline</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Sequence: Base → Vessel → Station → Field Camp → Return
              </span>
            </div>

            <div className="relative pl-6 space-y-3 pt-2">
              {/* Vertical timeline line */}
              <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-slate-800" />

              {selectedGroup.movementTimeline.map((step, idx) => {
                const isCompleted = step.status === "COMPLETED";
                const isActive = step.status === "ACTIVE";
                const isUpcoming = step.status === "UPCOMING";

                return (
                  <div key={idx} className="relative flex items-start gap-3">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-6 mt-1 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold ${
                        isCompleted
                          ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                          : isActive
                          ? "bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_10px_#06b6d4] animate-pulse"
                          : "bg-slate-950 border-slate-700 text-slate-500"
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Step Card */}
                    <div
                      className={`w-full p-2.5 rounded-lg border text-xs ${
                        isActive
                          ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-100"
                          : isCompleted
                          ? "bg-slate-950/60 border-slate-800/80 text-slate-300"
                          : "bg-slate-950/30 border-slate-900 text-slate-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold tracking-tight">
                          {step.stage.replace("_", " ")}: {step.location}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                            isCompleted
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                              : isActive
                              ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 animate-pulse font-bold"
                              : "text-slate-500"
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>

                      {(step.timestamp || step.eta || step.notes) && (
                        <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                          {step.timestamp && <span>Recorded: {step.timestamp}</span>}
                          {step.eta && <span className="text-amber-400">ETA: {step.eta}</span>}
                          {step.notes && <span className="italic text-slate-300">({step.notes})</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
