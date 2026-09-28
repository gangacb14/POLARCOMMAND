import React, { useState, useEffect } from "react";
import { PolarRouteIntel } from "../types";
import { 
  Navigation, 
  MapPin, 
  Anchor, 
  Compass, 
  Ship, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Wind, 
  RotateCw, 
  ArrowRight,
  TrendingDown,
  Layers,
  CheckCircle2
} from "lucide-react";

export const RouteIntelligenceView: React.FC = () => {
  const [routes, setRoutes] = useState<PolarRouteIntel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("ROUTE-POLAR-01");
  const [activeAlternativeRoutes, setActiveAlternativeRoutes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/routes/intel");
        if (res.ok) {
          const data = await res.json();
          setRoutes(data.routes || []);
        }
      } catch (e) {
        console.error("Failed to fetch route intel:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const getRiskBadge = (risk: "LOW" | "MEDIUM" | "HIGH") => {
    switch (risk) {
      case "HIGH":
        return "bg-rose-950/70 text-rose-400 border-rose-500/50 animate-pulse";
      case "MEDIUM":
        return "bg-amber-950/70 text-amber-400 border-amber-500/50";
      case "LOW":
        return "bg-emerald-950/70 text-emerald-400 border-emerald-500/50";
    }
  };

  return (
    <div className="space-y-4 text-slate-200">
      {/* Top Banner */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-950/80 border border-sky-500/40 text-sky-400">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight uppercase font-mono">
                Multi-Modal Polar Route Intelligence
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30 font-mono font-bold">
                SEA ICE RADAR OVERLAY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Visualizes the full multi-tier supply corridor from mainland staging ports through polar ice channels to research stations.
            </p>
          </div>
        </div>
      </div>

      {/* Corridor Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {routes.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRouteId(r.id)}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2 whitespace-nowrap transition ${
              selectedRouteId === r.id
                ? "bg-slate-800 text-white border-cyan-500/60 shadow-md font-bold"
                : "bg-[#0b1220] border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <span>{r.name}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getRiskBadge(r.routeRisk)}`}>
              {r.routeRisk}
            </span>
          </button>
        ))}
      </div>

      {selectedRoute && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Pipeline Multi-Modal Stepper */}
          <div className="lg:col-span-7 bg-[#0b1220] border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                  Multi-Tier Supply Corridor Pipeline
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedRoute.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">Total Corridor:</span>
                <div className="text-sm font-bold text-white font-mono">
                  {activeAlternativeRoutes[selectedRoute.id] && selectedRoute.alternativeDistanceKm
                    ? `${selectedRoute.alternativeDistanceKm} km`
                    : `${selectedRoute.distanceKm} km`}
                </div>
              </div>
            </div>

            {/* Vertical / Responsive Multi-Modal Progression: Origin ↓ Port ↓ Vessel ↓ Polar Route ↓ Station */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-sky-500 before:to-emerald-500">
              {/* Step 1: Origin */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-cyan-600 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white shadow-xs">
                  1
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-0.5">
                    Stage 1: Mainland Sourcing Origin
                  </div>
                  <div className="text-sm font-bold text-white">
                    {selectedRoute.origin}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Quality inspection, cryogenic packing, and customs seal authorization.
                  </div>
                </div>
              </div>

              {/* Step 2: Staging Port */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-sky-600 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white shadow-xs">
                  2
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                  <div className="text-[10px] font-mono text-sky-400 uppercase tracking-wider mb-0.5">
                    Stage 2: Staging Sea Port
                  </div>
                  <div className="text-sm font-bold text-white">
                    {selectedRoute.port}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Cargo gantry crane loading, reefers energized, reefer temperature log verification.
                  </div>
                </div>
              </div>

              {/* Step 3: Carrier Vessel / Convoy */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white shadow-xs">
                  3
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                  <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-0.5">
                    Stage 3: Assigned Carrier Asset
                  </div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Ship className="w-4 h-4 text-indigo-400" />
                    <span>{selectedRoute.vessel}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono mt-1 bg-slate-950 p-2 rounded border border-slate-800">
                    Live Status: {selectedRoute.cargoStatus}
                  </div>
                </div>
              </div>

              {/* Step 4: Polar Navigation Route */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white shadow-xs">
                  4
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-0.5">
                    Stage 4: Polar Route Corridor
                  </div>
                  <div className="text-sm font-bold text-white">
                    {activeAlternativeRoutes[selectedRoute.id] && selectedRoute.alternativeRouteName
                      ? selectedRoute.alternativeRouteName
                      : selectedRoute.polarRoute}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Weather Condition: {selectedRoute.weatherRisk}
                  </div>
                </div>
              </div>

              {/* Step 5: Research Station */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white shadow-xs">
                  5
                </div>
                <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-lg p-3">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-0.5">
                    Stage 5: Destination Research Station
                  </div>
                  <div className="text-sm font-bold text-emerald-200">
                    {selectedRoute.destinationStation}
                  </div>
                  <div className="text-xs text-emerald-300/80 mt-1">
                    Offload apron landing, Antarctic Treaty environmental audit, storage vault induction.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Route Risk Analysis, Delay Probability & Alternative Corridors */}
          <div className="lg:col-span-5 space-y-4">
            {/* Risk & Delay Probability Panel */}
            <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider">
                  Corridor Risk Evaluation
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskBadge(selectedRoute.routeRisk)}`}>
                  ● {selectedRoute.routeRisk} RISK
                </span>
              </div>

              {/* Delay Probability Radial / Progress Bar */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Delay Probability Indicator:</span>
                  <span className={`font-bold ${
                    selectedRoute.delayProbabilityPct > 50 ? "text-rose-400" :
                    selectedRoute.delayProbabilityPct > 25 ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    {selectedRoute.delayProbabilityPct}% Chance of Delay
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      selectedRoute.delayProbabilityPct > 50 ? "bg-rose-500" :
                      selectedRoute.delayProbabilityPct > 25 ? "bg-amber-400" : "bg-emerald-500"
                    }`}
                    style={{ width: `${selectedRoute.delayProbabilityPct}%` }}
                  />
                </div>
              </div>

              {/* Transit Estimates */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Est. Travel Time:</span>
                  <span className="font-bold text-white text-sm">
                    {activeAlternativeRoutes[selectedRoute.id] && selectedRoute.alternativeTravelTimeDays
                      ? `${selectedRoute.alternativeTravelTimeDays} Days`
                      : `${selectedRoute.estimatedTravelTimeDays} Days`}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Atmospheric Risk:</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {selectedRoute.weatherRisk}
                  </span>
                </div>
              </div>

              {/* Plain Language Risk Explanation */}
              <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 block mb-1">
                  Commander Tactical Risk Assessment:
                </span>
                <p className="font-sans text-slate-200 leading-relaxed">
                  “{selectedRoute.riskExplanation}”
                </p>
              </div>
            </div>

            {/* Alternative Route Section */}
            {selectedRoute.alternativeRouteName && (
              <div className="bg-[#0b1220] border border-cyan-500/40 rounded-xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5" />
                    Available Alternative Route
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                    STANDBY
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs">
                  <div className="font-bold text-white text-sm">
                    {selectedRoute.alternativeRouteName}
                  </div>
                  <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px] mt-2">
                    <span>Distance: {selectedRoute.alternativeDistanceKm} km</span>
                    <span>Travel: {selectedRoute.alternativeTravelTimeDays} Days</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-2 font-sans">
                    Diverts clear of heavy 88% pack-ice front via icebreaker-assisted deep offshore lead. Reduces delay risk by 38%.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setActiveAlternativeRoutes({
                      ...activeAlternativeRoutes,
                      [selectedRoute.id]: !activeAlternativeRoutes[selectedRoute.id],
                    })
                  }
                  className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    activeAlternativeRoutes[selectedRoute.id]
                      ? "bg-cyan-900/80 text-cyan-300 border border-cyan-500/50"
                      : "bg-cyan-600 hover:bg-cyan-500 text-white"
                  }`}
                >
                  {activeAlternativeRoutes[selectedRoute.id] ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Alternative Route Active</span>
                    </>
                  ) : (
                    <>
                      <span>Switch to Alternative Route</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
