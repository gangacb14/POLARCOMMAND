import React, { useState } from "react";
import { MOCK_RESOURCES } from "../data/mockPolarData";
import { ResourceTwin } from "../types";
import {
  Boxes,
  Fuel,
  Utensils,
  Droplets,
  Wind,
  HeartPulse,
  Zap,
  Radio,
  Microscope,
  Truck,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Clock,
  TrendingDown,
  ChevronRight,
  Sparkles,
  Search,
} from "lucide-react";

interface ResourceDigitalTwinViewProps {
  onOpenSimulator?: () => void;
}

export const ResourceDigitalTwinView: React.FC<ResourceDigitalTwinViewProps> = ({
  onOpenSimulator,
}) => {
  const [resources] = useState<ResourceTwin[]>(MOCK_RESOURCES);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Fuel":
        return Fuel;
      case "Utensils":
        return Utensils;
      case "Droplets":
        return Droplets;
      case "Wind":
        return Wind;
      case "HeartPulse":
        return HeartPulse;
      case "Zap":
        return Zap;
      case "Radio":
        return Radio;
      case "Microscope":
        return Microscope;
      case "Truck":
        return Truck;
      default:
        return Boxes;
    }
  };

  const getStatusColor = (status: string, level: number) => {
    if (status === "CRITICAL" || level < 50) {
      return {
        border: "border-red-500/60",
        bg: "bg-red-950/20",
        badge: "bg-red-950 text-red-300 border-red-500/50",
        fill: "#ef4444",
        text: "text-red-400",
      };
    }
    if (status === "ATTENTION" || level < 70) {
      return {
        border: "border-amber-500/60",
        bg: "bg-amber-950/20",
        badge: "bg-amber-950 text-amber-300 border-amber-500/50",
        fill: "#f59e0b",
        text: "text-amber-400",
      };
    }
    return {
      border: "border-emerald-500/40",
      bg: "bg-emerald-950/10",
      badge: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
      fill: "#10b981",
      text: "text-emerald-400",
    };
  };

  const filteredResources = resources.filter((res) => {
    const matchesCat = selectedCategory === "ALL" || res.category === selectedCategory;
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black font-mono tracking-tight text-white uppercase">
                Resource Digital Twin & Critical Lifelines
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                9 CORE CRITICAL RESOURCES
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Continuous burn rate monitoring, safety reserve buffers, stockout horizons, and automated maritime resupply synchronization.
            </p>
          </div>
        </div>

        {/* Quick Simulator CTA */}
        {onOpenSimulator && (
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold transition shadow-sm self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Simulate Stockout Scenarios</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          {[
            { id: "ALL", label: "All 9 Resources" },
            { id: "ENERGY", label: "Energy & Power" },
            { id: "LIFE_SUPPORT", label: "Life Support (Water/O2/Food/Meds)" },
            { id: "LOGISTICS", label: "Vehicles & Gear" },
            { id: "CRITICAL_COMMS", label: "Satellite Comms" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                selectedCategory === cat.id
                  ? "bg-slate-800 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search resource or depot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500 w-52"
          />
        </div>
      </div>

      {/* 9 Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => {
          const Icon = getIcon(res.iconName);
          const styling = getStatusColor(res.status, res.currentLevelPct);

          return (
            <div
              key={res.id}
              className={`rounded-xl border p-4 transition duration-200 ${styling.bg} ${styling.border} bg-[#0b1220] shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border ${styling.badge}`}
                    >
                      <Icon className={`w-5 h-5 ${styling.text}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black font-mono text-white tracking-tight">
                        {res.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {res.location}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${styling.badge}`}
                  >
                    {res.status}
                  </span>
                </div>

                {/* Level Gauge & Big Metric */}
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">Current Capacity</span>
                    <span className="text-3xl font-black font-mono tracking-tight text-white">
                      {res.currentLevelPct}%
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-300">
                    {res.totalQuantity}
                  </span>
                </div>

                {/* Progress Bar with Safety Threshold Marker */}
                <div className="mt-2 w-full bg-slate-900 rounded-full h-2.5 relative overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${res.currentLevelPct}%`,
                      backgroundColor: styling.fill,
                    }}
                  />
                  {/* Threshold notch at 25% for critical reserve */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-400"
                    style={{ left: "25%" }}
                    title="Minimum Safety Reserve Line (25%)"
                  />
                </div>

                {/* Specific Metrics: Consumption, Depletion, Required Reserve */}
                <div className="mt-3.5 grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Burn Rate</span>
                    <span className="text-slate-200 font-bold">{res.consumptionRate}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Predicted Depletion</span>
                    <span
                      className={`font-black ${
                        res.predictedDepletionDays <= res.requiredReserveDays
                          ? "text-red-400 animate-pulse"
                          : "text-amber-300"
                      }`}
                    >
                      {res.predictedDepletionDays} Days
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Required Reserve</span>
                    <span className="text-slate-200 font-bold">{res.requiredReserveDays} Days</span>
                  </div>
                </div>
              </div>

              {/* Resupply Pipeline Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-slate-400 truncate">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{res.resupplyStatus}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
