import React, { useState } from "react";
import { MOCK_WEATHER_IMPACTS } from "../data/mockPolarData";
import { WeatherImpactItem } from "../types";
import {
  CloudLightning,
  Wind,
  Thermometer,
  Eye,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Ship,
  Truck,
  Users,
  Tent,
  CheckCircle2,
  Navigation,
} from "lucide-react";

interface WeatherImpactEngineViewProps {
  onNavigateToRouteIntel?: () => void;
  onNavigateToPersonnel?: () => void;
}

export const WeatherImpactEngineView: React.FC<WeatherImpactEngineViewProps> = ({
  onNavigateToRouteIntel,
  onNavigateToPersonnel,
}) => {
  const [impacts] = useState<WeatherImpactItem[]>(MOCK_WEATHER_IMPACTS);
  const [selectedZoneId, setSelectedZoneId] = useState<string>("WTR-ZONE-01");

  const selectedImpact = impacts.find((i) => i.id === selectedZoneId) || impacts[0];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <CloudLightning className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black font-mono tracking-tight text-white uppercase">
                Weather → Operational Impact Engine
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                METEOROLOGY TO LOGISTICS CORRELATION
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Environmental inputs automatically compute logistical friction, maritime delay vectors, ground traverse safety, and shelter directives.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
          <span>Katabatic Gale Active in Zone 02</span>
        </div>
      </div>

      {/* Main Grid: Weather Zones Matrix & Operational Impact Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Weather Impact Zones List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {impacts.map((zone) => {
            const isSelected = zone.id === selectedZoneId;
            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`cursor-pointer rounded-xl p-4 transition border ${
                  isSelected
                    ? "bg-[#0f172a] border-cyan-500 shadow-lg shadow-cyan-950/30"
                    : "bg-[#0b1220] border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black font-mono text-white tracking-tight">
                    {zone.zone}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    {zone.tempC}°C
                  </span>
                </div>

                <div className="mt-2 text-xs font-mono text-cyan-300">
                  {zone.condition}
                </div>

                <div className="mt-2.5 flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-cyan-400" />
                    {zone.windSpeedKmh} km/h
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    Vis: {zone.visibilityKm} km
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {zone.operationalImpacts.personnelMovement}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: DEEP OPERATIONAL IMPACT TRANSLATION (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1220] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Automated Meteorological Synthesis
              </span>
              <h3 className="text-base font-black font-mono text-white tracking-tight">
                {selectedImpact.zone}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="p-1.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" />
                {selectedImpact.tempC}°C
              </span>
              <span className="p-1.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5" />
                {selectedImpact.windSpeedKmh} km/h
              </span>
            </div>
          </div>

          {/* Direct Logistical Impacts Breakdown */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Direct Impact on Mission Logistics & Safety:
            </span>

            {/* 1. Cargo Routes Impact */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Cargo Routes Status</span>
              </div>
              <div className="space-y-1 pl-6">
                {selectedImpact.operationalImpacts.cargoRoutes.map((route, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{route.routeName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        route.risk === "HIGH RISK"
                          ? "bg-red-950 text-red-300 border-red-500/50"
                          : route.risk === "MODERATE"
                          ? "bg-amber-950 text-amber-300 border-amber-500/50"
                          : "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                      }`}
                    >
                      {route.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Personnel Movement */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Personnel Movement Clearance</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    selectedImpact.operationalImpacts.personnelMovement === "RESTRICTED" ||
                    selectedImpact.operationalImpacts.personnelMovement === "STANDBY_SHELTER"
                      ? "bg-red-950 text-red-300 border-red-500/50 animate-pulse"
                      : "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                  }`}
                >
                  {selectedImpact.operationalImpacts.personnelMovement}
                </span>
              </div>
              <p className="text-xs text-slate-300 pl-6">
                {selectedImpact.operationalImpacts.personnelMovement === "STANDBY_SHELTER"
                  ? "Tethered lifelines mandatory outside insulated modules. No solitary traversal."
                  : "Normal traverse with check-in every 120 minutes."}
              </p>
            </div>

            {/* 3. Vessel Arrival */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                <Ship className="w-4 h-4 text-cyan-400" />
                <span>Maritime Vessel Arrival Vector</span>
              </div>
              <p className="text-xs text-slate-300 pl-6 font-mono">
                {selectedImpact.operationalImpacts.vesselArrival}
              </p>
            </div>

            {/* 4. Field Camp Status */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                <Tent className="w-4 h-4 text-cyan-400" />
                <span>Field Camp Advisory</span>
              </div>
              <p className="text-xs text-slate-300 pl-6 font-mono">
                {selectedImpact.operationalImpacts.fieldCampAlert}
              </p>
            </div>
          </div>

          {/* Operational Directive Callout */}
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-lg space-y-1">
            <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block">
              Autonomous Operational Directive:
            </span>
            <p className="text-xs text-slate-200 font-sans">
              “{selectedImpact.directive}”
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="pt-2 flex items-center gap-2 text-xs font-mono">
            {onNavigateToRouteIntel && (
              <button
                onClick={onNavigateToRouteIntel}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-1 transition"
              >
                <span>View Affected Maritime Corridors</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            {onNavigateToPersonnel && (
              <button
                onClick={onNavigateToPersonnel}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 transition"
              >
                <span>Check Field Team Positions</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
