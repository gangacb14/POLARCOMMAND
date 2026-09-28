import React, { useState, useEffect } from "react";
import { ResupplyRecommendation } from "../types";
import { 
  Boxes, 
  Fuel, 
  HeartPulse, 
  Wrench, 
  ShieldCheck, 
  Calendar, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight,
  ExternalLink,
  Truck
} from "lucide-react";

interface SmartResupplyViewProps {
  currentStation: string;
  onNavigateToDigitalTwin?: () => void;
}

export const SmartResupplyView: React.FC<SmartResupplyViewProps> = ({
  currentStation,
  onNavigateToDigitalTwin,
}) => {
  const [recommendations, setRecommendations] = useState<ResupplyRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [approvedItems, setApprovedItems] = useState<Record<string, boolean>>({});

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resupply/recommendations");
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (e) {
      console.error("Resupply planner fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [currentStation]);

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "CRITICAL":
        return "bg-red-950/70 text-red-400 border-red-500/50 animate-pulse";
      case "HIGH":
        return "bg-orange-950/70 text-orange-400 border-orange-500/50";
      case "MEDIUM":
        return "bg-amber-950/70 text-amber-400 border-amber-500/50";
      default:
        return "bg-slate-900 text-slate-300 border-slate-700";
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "FUEL":
        return <Fuel className="w-4 h-4 text-amber-400" />;
      case "FOOD_RATIONS":
        return <Boxes className="w-4 h-4 text-cyan-400" />;
      case "MEDICAL":
        return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case "SPARE_PARTS":
        return <Wrench className="w-4 h-4 text-purple-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4 text-slate-200">
      {/* Top Banner */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <Boxes className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight uppercase font-mono">
                Predictive Resupply Engine & Autonomous Manifest Planner
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                DYNAMIC BURN EQUATIONS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Calculates precise replenishment orders before supply runway breaches Madrid Protocol survival margins.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            <span>Recalculate Runways</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Resupply Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((item) => {
          const isApproved = approvedItems[item.id];
          const hasDeliveryDeficit = item.daysRemainingBeforeStockout < item.nextWindowDeliveryDays;

          return (
            <div
              key={item.id}
              className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-3"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {item.resourceName}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        Station: {item.stagedStation}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getPriorityBadge(item.priority)}`}>
                    ● {item.priority} PRIORITY
                  </span>
                </div>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                  <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Current Stock:</span>
                    <span className="text-sm font-bold text-slate-200">{item.currentStock}</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Daily Consumption Rate:</span>
                    <span className="text-sm font-bold text-amber-400">{item.consumptionRate}</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Days to Stockout:</span>
                    <span className={`text-sm font-bold ${hasDeliveryDeficit ? "text-red-400" : "text-emerald-400"}`}>
                      {item.daysRemainingBeforeStockout} Days Remaining
                    </span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Next Delivery Window:</span>
                    <span className="text-sm font-bold text-cyan-400">
                      In {item.nextWindowDeliveryDays} Days
                    </span>
                  </div>
                </div>

                {/* Recommended Addition Badge */}
                <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-lg flex items-center justify-between mb-2">
                  <div className="text-xs">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider block">
                      Recommended Cargo Addition:
                    </span>
                    <span className="text-base font-black text-emerald-300 font-mono">
                      {item.recommendedAddition}
                    </span>
                  </div>
                  {hasDeliveryDeficit && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-red-400 bg-red-950/60 px-2 py-1 rounded border border-red-500/40">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Deficit Gap: +{item.nextWindowDeliveryDays - item.daysRemainingBeforeStockout}d</span>
                    </div>
                  )}
                </div>

                {/* Plain Language Reason */}
                <div className="text-xs text-slate-300 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 block mb-0.5">
                    Optimization Rationale:
                  </span>
                  <p className="font-sans leading-relaxed">
                    “{item.reason}”
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                {onNavigateToDigitalTwin && (
                  <button
                    onClick={onNavigateToDigitalTwin}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                  >
                    <span>View Station on Twin</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}

                <button
                  onClick={() => setApprovedItems({ ...approvedItems, [item.id]: true })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ml-auto ${
                    isApproved
                      ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                  }`}
                >
                  {isApproved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Manifest Staged</span>
                    </>
                  ) : (
                    <>
                      <span>Commit to Voyage Manifest</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
