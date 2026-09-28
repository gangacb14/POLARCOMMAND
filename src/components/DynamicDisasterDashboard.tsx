import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";
import {
  HazardFrequencyPoint,
  ResourceAllocationPoint,
  PopulationVulnerabilityPoint,
  UserRole,
  AppTheme,
} from "../types";
import {
  MOCK_HAZARD_FREQUENCY_DATA,
  MOCK_RESOURCE_ALLOCATION_DATA,
  MOCK_POPULATION_VULNERABILITY_DATA,
} from "../data/enhancedDisasterData";
import {
  TrendingUp,
  Boxes,
  Users,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Droplets,
  Wind,
  Layers,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface DynamicDisasterDashboardProps {
  userRole?: UserRole;
  theme?: AppTheme;
  onNavigateToGis?: () => void;
  onNavigateToPrioritization?: () => void;
  onNavigateToCitizen?: () => void;
  onNavigateToAnalytics?: () => void;
}

export const DynamicDisasterDashboard: React.FC<DynamicDisasterDashboardProps> = ({
  userRole = "ADMIN",
  theme = "DARK",
  onNavigateToGis,
  onNavigateToPrioritization,
  onNavigateToCitizen,
  onNavigateToAnalytics,
}) => {
  const [hazardMetricFilter, setHazardMetricFilter] = useState<"ALL" | "BLIZZARD" | "INUNDATION" | "CREVASSE">("ALL");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [hazardTimeframe, setHazardTimeframe] = useState<"12M" | "Q1" | "Q2" | "Q3" | "Q4">("12M");

  const isLight = theme === "PASTEL_LIGHT";

  // Filtered hazard frequency
  const filteredHazardData = MOCK_HAZARD_FREQUENCY_DATA.filter((item) => {
    if (hazardTimeframe === "Q1") return ["Jan", "Feb", "Mar"].includes(item.month);
    if (hazardTimeframe === "Q2") return ["Apr", "May", "Jun"].includes(item.month);
    if (hazardTimeframe === "Q3") return ["Jul", "Aug", "Sep"].includes(item.month);
    if (hazardTimeframe === "Q4") return ["Oct", "Nov", "Dec"].includes(item.month);
    return true;
  });

  // Filtered resource allocation
  const filteredResourceData = selectedSector === "ALL"
    ? MOCK_RESOURCE_ALLOCATION_DATA
    : MOCK_RESOURCE_ALLOCATION_DATA.filter((r) => r.sector.toLowerCase().includes(selectedSector.toLowerCase()));

  // Pastel Color Palette
  const PASTEL_COLORS = {
    coralRed: "#f87171",
    amberOrange: "#fb923c",
    skyCyan: "#38bdf8",
    emeraldMint: "#34d399",
    purpleLavender: "#a78bfa",
    indigoPastel: "#818cf8",
  };

  return (
    <div
      className={`space-y-5 transition-colors ${
        isLight ? "text-slate-800" : "text-slate-100"
      }`}
    >
      {/* Top Welcome & KPI Summary */}
      <div
        className={`p-5 rounded-2xl border backdrop-blur-md shadow-lg transition-all ${
          isLight
            ? "bg-[#faf8f5] border-[#e8e2d8] text-slate-900 shadow-amber-900/5"
            : "bg-[#0b1326]/90 border-slate-800 shadow-cyan-950/20"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  isLight
                    ? "bg-amber-100 text-amber-900 border border-amber-300/60"
                    : "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                }`}
              >
                SIH 062 Analytics & Real-Time Telemetry
              </span>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded ${
                  isLight ? "bg-slate-200 text-slate-700" : "bg-slate-800 text-slate-300"
                }`}
              >
                Role: {userRole}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight mt-1">
              Disaster Risk, Hazard Frequency & Resource Allocation Intelligence
            </h1>
            <p
              className={`text-xs sm:text-sm mt-0.5 ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Unified situational awareness with multi-hazard frequency modeling, dynamic inventory allocation, and population risk segmentation.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToGis && (
              <button
                onClick={onNavigateToGis}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition shadow-sm"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D GIS & Terrain</span>
              </button>
            )}
            {onNavigateToPrioritization && (
              <button
                onClick={onNavigateToPrioritization}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition shadow-sm"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Relocation Prioritizer</span>
              </button>
            )}
            {onNavigateToCitizen && (
              <button
                onClick={onNavigateToCitizen}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 transition shadow-sm"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Citizen Reports & SMS</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Core Quantitative KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          <div
            className={`p-3.5 rounded-xl border transition ${
              isLight
                ? "bg-white border-[#e3dcd1] shadow-xs"
                : "bg-slate-950/70 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono font-semibold uppercase ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Total Exposed Personnel
              </span>
              <Users className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black font-mono mt-1 text-cyan-600 dark:text-cyan-400">
              160 <span className="text-xs font-normal text-slate-500">Scientists/Crew</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>100% In Life-Support Range</span>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition ${
              isLight
                ? "bg-white border-[#e3dcd1] shadow-xs"
                : "bg-slate-950/70 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono font-semibold uppercase ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Critical Frontline Load
              </span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-black font-mono mt-1 text-red-600 dark:text-red-400">
              28 <span className="text-xs font-normal text-slate-500">Personnel (17.5%)</span>
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>Tier 1 Relocation Ready</span>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition ${
              isLight
                ? "bg-white border-[#e3dcd1] shadow-xs"
                : "bg-slate-950/70 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono font-semibold uppercase ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Safe Shelter Capacity
              </span>
              <Boxes className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black font-mono mt-1 text-emerald-600 dark:text-emerald-400">
              225 <span className="text-xs font-normal text-slate-500">Bed Limit (+65 Surplus)</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              5 Fortified Hubs Active
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition ${
              isLight
                ? "bg-white border-[#e3dcd1] shadow-xs"
                : "bg-slate-950/70 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono font-semibold uppercase ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Avg Rations & Fuel Autonomy
              </span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black font-mono mt-1 text-amber-600 dark:text-amber-400">
              156 <span className="text-xs font-normal text-slate-500">Days Buffer</span>
            </div>
            <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono mt-0.5 flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              <span>156,000L Potable Water</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Visualizations Grid: 3 Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* CHART 1: LINE CHART - Hazard Frequency Over Time (7 Cols) */}
        <div
          className={`lg:col-span-7 p-5 rounded-2xl border shadow-md flex flex-col justify-between ${
            isLight
              ? "bg-[#faf8f5] border-[#e8e2d8]"
              : "bg-[#0b1326]/90 border-slate-800"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/40">
            <div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-500" />
                <h3 className="text-sm font-bold font-mono uppercase tracking-wide">
                  Hazard Frequency & Extreme Event Dynamics
                </h3>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Monthly blizzard surges, crevasse opening rates, and glacial melt inundation events.
              </p>
            </div>

            {/* Timeframe selector & Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center bg-slate-900/60 p-0.5 rounded-lg border border-slate-700 text-xs font-mono">
                {(["12M", "Q1", "Q2", "Q3", "Q4"] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setHazardTimeframe(tf)}
                    className={`px-2 py-0.5 rounded transition ${
                      hazardTimeframe === tf
                        ? "bg-cyan-600 text-white font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Line Chart Render */}
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredHazardData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#e2d9cd" : "#1e293b"} />
                <XAxis
                  dataKey="month"
                  stroke={isLight ? "#64748b" : "#94a3b8"}
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke={isLight ? "#64748b" : "#94a3b8"}
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? "#ffffff" : "#0f172a",
                    borderColor: isLight ? "#cbd5e1" : "#334155",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: isLight ? "#0f172a" : "#f8fafc",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                />
                {(hazardMetricFilter === "ALL" || hazardMetricFilter === "BLIZZARD") && (
                  <Line
                    type="monotone"
                    dataKey="blizzardCount"
                    name="Blizzard Surges"
                    stroke={PASTEL_COLORS.coralRed}
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: PASTEL_COLORS.coralRed }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {(hazardMetricFilter === "ALL" || hazardMetricFilter === "INUNDATION") && (
                  <Line
                    type="monotone"
                    dataKey="meltInundation"
                    name="Melt Inundation Events"
                    stroke={PASTEL_COLORS.skyCyan}
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: PASTEL_COLORS.skyCyan }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {(hazardMetricFilter === "ALL" || hazardMetricFilter === "CREVASSE") && (
                  <Line
                    type="monotone"
                    dataKey="crevasseEvent"
                    name="Crevasse Widening"
                    stroke={PASTEL_COLORS.amberOrange}
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: PASTEL_COLORS.amberOrange }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-3 border-t border-slate-700/30 text-slate-500">
            <span>Peak Blizzard Season: June - August (Austral Winter)</span>
            <span>Peak Melt Season: December - February</span>
          </div>
        </div>

        {/* CHART 2: PIE CHART - Population Vulnerability Segmentation (5 Cols) */}
        <div
          className={`lg:col-span-5 p-5 rounded-2xl border shadow-md flex flex-col justify-between ${
            isLight
              ? "bg-[#faf8f5] border-[#e8e2d8]"
              : "bg-[#0b1326]/90 border-slate-800"
          }`}
        >
          <div className="pb-3 border-b border-slate-700/40">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold font-mono uppercase tracking-wide">
                Population Risk & Vulnerability
              </h3>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Proportional distribution of 160 expedition members across risk zones.
            </p>
          </div>

          {/* Pie Chart Render */}
          <div className="h-56 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_POPULATION_VULNERABILITY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {MOCK_POPULATION_VULNERABILITY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value} Personnel (${item.payload.percentage}%)`,
                    item.payload.category,
                  ]}
                  contentStyle={{
                    backgroundColor: isLight ? "#ffffff" : "#0f172a",
                    borderColor: isLight ? "#cbd5e1" : "#334155",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: isLight ? "#0f172a" : "#f8fafc",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Pie Legend Breakdown */}
          <div className="space-y-1.5 pt-2 border-t border-slate-700/30 text-xs font-mono">
            {MOCK_POPULATION_VULNERABILITY_DATA.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`text-[11px] truncate max-w-[170px] ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{item.count}</span>
                  <span className="text-slate-500 text-[10px]">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 3: BAR CHART - Resource Allocation Across Sectors (12 Cols) */}
        <div
          className={`lg:col-span-12 p-5 rounded-2xl border shadow-md space-y-4 ${
            isLight
              ? "bg-[#faf8f5] border-[#e8e2d8]"
              : "bg-[#0b1326]/90 border-slate-800"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
            <div>
              <div className="flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold font-mono uppercase tracking-wide">
                  Strategic Resource Allocation by Operational Sector
                </h3>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Fuel stock (kL), emergency rations (days of autonomy), trauma medical kits, and power reserves.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">Filter:</span>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className={`text-xs font-mono px-2.5 py-1.5 rounded-lg border outline-none transition ${
                  isLight
                    ? "bg-white border-slate-300 text-slate-800"
                    : "bg-slate-900 border-slate-700 text-slate-200"
                }`}
              >
                <option value="ALL">All Sectors (Comparative)</option>
                <option value="Maitri">Sector A (Maitri)</option>
                <option value="Bharati">Sector B (Bharati)</option>
                <option value="Himadri">Sector C (Himadri)</option>
                <option value="Traverse">Sector D (Traverse Ice)</option>
                <option value="Prydz">Sector E (Prydz Bay Coast)</option>
              </select>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredResourceData}
                margin={{ top: 10, right: 20, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#e2d9cd" : "#1e293b"} />
                <XAxis
                  dataKey="sector"
                  stroke={isLight ? "#64748b" : "#94a3b8"}
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  stroke={isLight ? "#64748b" : "#94a3b8"}
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? "#ffffff" : "#0f172a",
                    borderColor: isLight ? "#cbd5e1" : "#334155",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: isLight ? "#0f172a" : "#f8fafc",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar
                  dataKey="fuelLitersK"
                  name="Fuel Reserves (kL)"
                  fill={PASTEL_COLORS.skyCyan}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="rationsDays"
                  name="Rations Autonomy (Days)"
                  fill={PASTEL_COLORS.emeraldMint}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="powerKwh"
                  name="Generator Power (kW)"
                  fill={PASTEL_COLORS.amberOrange}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="safeCapacityPeople"
                  name="Safe Bed Capacity"
                  fill={PASTEL_COLORS.purpleLavender}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
