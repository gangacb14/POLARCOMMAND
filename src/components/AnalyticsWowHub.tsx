import React, { useState } from "react";
import {
  WardRelocationRanking,
  CarryingCapacityResult,
  MLHazardForecast,
  PolicyBriefDocument,
  UserRole,
  AppTheme,
} from "../types";
import {
  MOCK_RELOCATION_RANKINGS,
  MOCK_SAFE_SHELTERS,
  MOCK_ML_HAZARD_FORECASTS,
  MOCK_POLICY_BRIEF,
} from "../data/enhancedDisasterData";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  Calculator,
  BrainCircuit,
  FileText,
  Sliders,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  Users,
  Droplets,
  Zap,
  Home,
  ArrowRight,
  ShieldCheck,
  Scale,
} from "lucide-react";

interface AnalyticsWowHubProps {
  userRole?: UserRole;
  theme?: AppTheme;
  onInitiateRelocation?: (ward: WardRelocationRanking) => void;
}

export const AnalyticsWowHub: React.FC<AnalyticsWowHubProps> = ({
  userRole = "ADMIN",
  theme = "DARK",
  onInitiateRelocation,
}) => {
  const isLight = theme === "PASTEL_LIGHT";
  const [activeSection, setActiveSection] = useState<"PRIORITIZATION" | "CAPACITY" | "ML_FORECAST" | "POLICY_BRIEF">("PRIORITIZATION");

  // ================= 1. MCDA PRIORITIZATION WEIGHTS =================
  const [wHazard, setWHazard] = useState<number>(30);
  const [wSlope, setWSlope] = useState<number>(25);
  const [wPopulation, setWPopulation] = useState<number>(20);
  const [wInfra, setWInfra] = useState<number>(15);
  const [wRoadCutoff, setWRoadCutoff] = useState<number>(10);

  const [relocationOrders, setRelocationOrders] = useState<WardRelocationRanking[]>(MOCK_RELOCATION_RANKINGS);
  const [evacNotice, setEvacNotice] = useState<string | null>(null);

  // Recalculate priority scores based on custom user weights
  const totalWeight = wHazard + wSlope + wPopulation + wInfra + wRoadCutoff;
  const recalculatedWards = relocationOrders
    .map((w) => {
      const score = (
        (w.hazardExposureScore * wHazard) +
        ((w.terrainSlopeDeg / 45) * 100 * wSlope) +
        ((w.population / 50) * 100 * wPopulation) +
        (w.criticalInfraProximityScore * wInfra) +
        (w.roadCutoffRiskPct * wRoadCutoff)
      ) / (totalWeight || 1);

      let priorityTier: WardRelocationRanking["priorityTier"] = "TIER_3_MONITORING";
      if (score >= 75) priorityTier = "TIER_1_URGENT_EVAC";
      else if (score >= 50) priorityTier = "TIER_2_HIGH_VIGILANCE";

      return {
        ...w,
        calculatedPriorityScore: Number(score.toFixed(1)),
        priorityTier,
      };
    })
    .sort((a, b) => b.calculatedPriorityScore - a.calculatedPriorityScore);

  const handleTriggerRelocation = (ward: WardRelocationRanking) => {
    setEvacNotice(`🚨 RELOCATION AUTHORIZED: Evacuating ${ward.population} personnel from "${ward.wardName}" to "${ward.designatedSafeShelter}" via ${ward.transitRouteId}!`);
    if (onInitiateRelocation) onInitiateRelocation(ward);
    setTimeout(() => setEvacNotice(null), 6000);
  };

  // ================= 2. CARRYING CAPACITY CALCULATOR =================
  const [selectedShelterId, setSelectedShelterId] = useState<string>(MOCK_SAFE_SHELTERS[0].id);
  const [incomingEvacuees, setIncomingEvacuees] = useState<number>(24);
  const [durationDays, setDurationDays] = useState<number>(14);

  const activeShelter = MOCK_SAFE_SHELTERS.find((s) => s.id === selectedShelterId) || MOCK_SAFE_SHELTERS[0];
  const totalOccupants = activeShelter.currentOccupancy + incomingEvacuees;
  const bedOccupancyPct = Math.round((totalOccupants / activeShelter.maxCapacity) * 100);
  const waterPerPersonPerDay = 35; // Liters
  const foodPerPersonPerDay = 1.8; // kg
  const powerPerPersonKw = 1.2; // kW load

  const waterAutonomyDays = Math.round(activeShelter.potableWaterLiters / (totalOccupants * waterPerPersonPerDay));
  const foodAutonomyDays = Math.round(activeShelter.rationsDays * (activeShelter.maxCapacity / totalOccupants));
  const powerSurplus = activeShelter.powerKw - (totalOccupants * powerPerPersonKw);
  const spacePerPersonSqM = (350 / totalOccupants).toFixed(1);

  const deficits: string[] = [];
  if (bedOccupancyPct > 100) deficits.push(`Bed Deficit: ${totalOccupants - activeShelter.maxCapacity} evacuees will require emergency bivy tents.`);
  if (waterAutonomyDays < durationDays) deficits.push(`Water Deficit: Water supply lasts only ${waterAutonomyDays} days (target: ${durationDays} days).`);
  if (powerSurplus < 0) deficits.push(`Power Deficit: Generator overloaded by ${Math.abs(powerSurplus).toFixed(1)} kW.`);

  const safetyMarginPct = Math.max(10, Math.min(100, Math.round(
    ((activeShelter.maxCapacity / (totalOccupants || 1)) * 40) +
    ((waterAutonomyDays / (durationDays || 1)) * 30) +
    ((foodAutonomyDays / (durationDays || 1)) * 30)
  )));

  // ================= 3. ML HAZARD FORECASTING =================
  const [selectedMlForecast, setSelectedMlForecast] = useState<MLHazardForecast>(MOCK_ML_HAZARD_FORECASTS[0]);

  // ================= 4. POLICY BRIEF DOSSIER =================
  const [policyBrief, setPolicyBrief] = useState<PolicyBriefDocument>(MOCK_POLICY_BRIEF);
  const [copiedBrief, setCopiedBrief] = useState(false);

  const handleCopyPolicyBrief = () => {
    const briefText = `# ${policyBrief.title}\nAuthority: ${policyBrief.targetAuthority}\nDate: ${policyBrief.generatedAt}\n\n${policyBrief.executiveSummary}\n\n## Priority Relocation:\n${policyBrief.priorityRelocationDirectives.map((d) => `- Rank ${d.rank}: ${d.wardName} -> ${d.actionRequired}`).join("\n")}\n\nSeal: ${policyBrief.cryptographicSeal}`;
    navigator.clipboard.writeText(briefText);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 3000);
  };

  const handlePrintBrief = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Navigation Ribbon for Analytics Sub-Modules */}
      <div
        className={`p-3 rounded-2xl border backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-2 ${
          isLight
            ? "bg-[#faf8f5] border-[#e8e2d8] text-slate-800"
            : "bg-[#0b1326]/90 border-slate-800 text-slate-100"
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveSection("PRIORITIZATION")}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              activeSection === "PRIORITIZATION"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>RELOCATION PRIORITIZATION (MCDA)</span>
          </button>

          <button
            onClick={() => setActiveSection("CAPACITY")}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              activeSection === "CAPACITY"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>SAFE SITE CARRYING CAPACITY</span>
          </button>

          <button
            onClick={() => setActiveSection("ML_FORECAST")}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              activeSection === "ML_FORECAST"
                ? "bg-purple-600 text-white shadow-md shadow-purple-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>PREDICTIVE ML HAZARD FORECASTING</span>
          </button>

          <button
            onClick={() => setActiveSection("POLICY_BRIEF")}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              activeSection === "POLICY_BRIEF"
                ? "bg-amber-600 text-white shadow-md shadow-amber-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>AUTO POLICY BRIEFS & SITREP</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-cyan-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
          Decision Engine: MCDA TOPSIS + Ensemble ML
        </div>
      </div>

      {/* Global Evacuation Toast Notice */}
      {evacNotice && (
        <div className="p-3.5 rounded-xl bg-red-950 border border-red-500 text-white text-xs font-mono font-bold flex items-center justify-between shadow-xl animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span>{evacNotice}</span>
          </div>
          <button
            onClick={() => setEvacNotice(null)}
            className="text-red-200 hover:text-white underline text-xs font-normal"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ================= 1. PRIORITIZATION ENGINE ================= */}
      {activeSection === "PRIORITIZATION" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Custom Weight Sliders (4 cols) */}
          <div
            className={`lg:col-span-4 p-5 rounded-2xl border shadow-md space-y-4 ${
              isLight
                ? "bg-[#faf8f5] border-[#e8e2d8]"
                : "bg-[#0b1326]/90 border-slate-800"
            }`}
          >
            <div>
              <h3 className="text-base font-bold font-mono uppercase flex items-center gap-2 text-emerald-500">
                <Sliders className="w-5 h-5" />
                <span>MCDA Weight Configuration</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Adjust multi-criteria risk priorities to re-rank wards dynamically in real time.
              </p>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Hazard Exposure (Melt/Blizzard):</span>
                  <span className="text-emerald-400 font-bold">{wHazard}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={wHazard}
                  onChange={(e) => setWHazard(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Terrain Slope & Avalanche Angle:</span>
                  <span className="text-emerald-400 font-bold">{wSlope}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={wSlope}
                  onChange={(e) => setWSlope(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Population / Vulnerable Density:</span>
                  <span className="text-emerald-400 font-bold">{wPopulation}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={wPopulation}
                  onChange={(e) => setWPopulation(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Critical Infrastructure Proximity:</span>
                  <span className="text-emerald-400 font-bold">{wInfra}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={wInfra}
                  onChange={(e) => setWInfra(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Evacuation Road / Corridor Cutoff:</span>
                  <span className="text-emerald-400 font-bold">{wRoadCutoff}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={wRoadCutoff}
                  onChange={(e) => setWRoadCutoff(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/40 text-[11px] font-mono text-slate-500 flex items-center justify-between">
              <span>Combined Weight Sum:</span>
              <span className="font-bold text-white">{totalWeight}%</span>
            </div>
          </div>

          {/* Right: Ranked Relocation Priority Table (8 cols) */}
          <div
            className={`lg:col-span-8 p-5 rounded-2xl border shadow-md space-y-4 ${
              isLight
                ? "bg-[#faf8f5] border-[#e8e2d8]"
                : "bg-[#0b1326]/90 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
              <div>
                <h3 className="text-base font-bold font-mono uppercase flex items-center gap-2 text-white">
                  <span>Prioritized Wards / Polar Sectors for Relocation</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  Ordered by composite risk score. Authorize instant protocol to initiate evacuation convoy.
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                {recalculatedWards.length} Sectors Ranked
              </span>
            </div>

            <div className="space-y-3">
              {recalculatedWards.map((w, index) => (
                <div
                  key={w.id}
                  className={`p-4 rounded-xl border transition space-y-2.5 ${
                    w.priorityTier === "TIER_1_URGENT_EVAC"
                      ? "bg-red-950/40 border-red-500/80 shadow-md shadow-red-950/20"
                      : w.priorityTier === "TIER_2_HIGH_VIGILANCE"
                      ? "bg-amber-950/30 border-amber-500/60"
                      : "bg-slate-950/60 border-slate-800"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 font-mono font-black text-sm flex items-center justify-center text-cyan-400">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold font-mono text-white">
                          {w.wardName}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          Sector: {w.sectorCode} • Population: {w.population} ({w.vulnerableDemographics} High-Risk)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">
                          Risk Score: <span className="text-cyan-400">{w.calculatedPriorityScore}</span> / 100
                        </div>
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                            w.priorityTier === "TIER_1_URGENT_EVAC"
                              ? "bg-red-900 text-red-200 border border-red-500"
                              : w.priorityTier === "TIER_2_HIGH_VIGILANCE"
                              ? "bg-amber-900 text-amber-200 border border-amber-500"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {w.priorityTier.replace(/_/g, " ")}
                        </span>
                      </div>

                      {userRole === "ADMIN" && (
                        <button
                          onClick={() => handleTriggerRelocation(w)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition ${
                            w.priorityTier === "TIER_1_URGENT_EVAC"
                              ? "bg-red-600 hover:bg-red-500 text-white shadow-sm"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                          }`}
                        >
                          <span>Authorize Evac</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quantitative Details Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                    <div>Hazard Score: <span className="text-white font-bold">{w.hazardExposureScore}</span></div>
                    <div>Slope Angle: <span className="text-white font-bold">{w.terrainSlopeDeg}°</span></div>
                    <div>Flood Depth: <span className="text-white font-bold">{w.floodMeltDepthM}m</span></div>
                    <div>Corridor Cutoff: <span className="text-white font-bold">{w.roadCutoffRiskPct}%</span></div>
                  </div>

                  <div className="text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                    <span>Safe Shelter: {w.designatedSafeShelter}</span>
                    <span>Route: {w.transitRouteId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. SAFE SITE CARRYING CAPACITY ================= */}
      {activeSection === "CAPACITY" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Interactive Capacity Simulator (5 cols) */}
          <div
            className={`lg:col-span-5 p-5 rounded-2xl border shadow-md space-y-4 ${
              isLight
                ? "bg-[#faf8f5] border-[#e8e2d8]"
                : "bg-[#0b1326]/90 border-slate-800"
            }`}
          >
            <div>
              <h3 className="text-base font-bold font-mono uppercase flex items-center gap-2 text-cyan-500">
                <Calculator className="w-5 h-5" />
                <span>Safe Shelter Influx Simulator</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Calculate life-support longevity against sudden incoming evacuee waves.
              </p>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Target Safe Shelter Site</label>
                <select
                  value={selectedShelterId}
                  onChange={(e) => setSelectedShelterId(e.target.value)}
                  className={`w-full p-2 rounded-xl border outline-none ${
                    isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                  }`}
                >
                  {MOCK_SAFE_SHELTERS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Max {s.maxCapacity} Beds)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Incoming Displaced Evacuees:</span>
                  <span className="text-cyan-400 font-bold">+{incomingEvacuees} Personnel</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={incomingEvacuees}
                  onChange={(e) => setIncomingEvacuees(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Planned Shelter Stay Duration:</span>
                  <span className="text-cyan-400 font-bold">{durationDays} Days</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={60}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              {/* Shelter Specs Quick Stats */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Current Occupants:</span>
                  <span className="text-white font-bold">{activeShelter.currentOccupancy}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Water Tank Volume:</span>
                  <span className="text-white font-bold">{activeShelter.potableWaterLiters.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Generator Rating:</span>
                  <span className="text-white font-bold">{activeShelter.powerKw} kW</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Medical Triage Cots:</span>
                  <span className="text-white font-bold">{activeShelter.medicalBeds}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Carrying Capacity Verdict & Resource Longevity (7 cols) */}
          <div
            className={`lg:col-span-7 p-5 rounded-2xl border shadow-md space-y-4 ${
              isLight
                ? "bg-[#faf8f5] border-[#e8e2d8]"
                : "bg-[#0b1326]/90 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
              <div>
                <h3 className="text-base font-bold font-mono uppercase text-white">
                  Carrying Capacity Longevity Analysis
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  Combined Load: {totalOccupants} Persons ({activeShelter.currentOccupancy} Baseline + {incomingEvacuees} Evacuees)
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-400">Safety Margin</div>
                <div className={`text-lg font-black font-mono ${safetyMarginPct > 60 ? "text-emerald-400" : "text-amber-400"}`}>
                  {safetyMarginPct}%
                </div>
              </div>
            </div>

            {/* 4 Quantitative Computed Lifeline Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Bed Occupancy</span>
                  <Home className="w-4 h-4 text-cyan-500" />
                </div>
                <div className={`text-xl font-black font-mono ${bedOccupancyPct > 100 ? "text-red-400" : "text-cyan-400"}`}>
                  {bedOccupancyPct}% <span className="text-xs font-normal text-slate-400">({totalOccupants}/{activeShelter.maxCapacity})</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Space: {spacePerPersonSqM} m²/person
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Potable Water Autonomy</span>
                  <Droplets className="w-4 h-4 text-sky-500" />
                </div>
                <div className={`text-xl font-black font-mono ${waterAutonomyDays < durationDays ? "text-red-400" : "text-sky-400"}`}>
                  {waterAutonomyDays} <span className="text-xs font-normal text-slate-400">Days</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Target: {durationDays} Days Duration
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Rations Autonomy</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl font-black font-mono text-emerald-400">
                  {foodAutonomyDays} <span className="text-xs font-normal text-slate-400">Days</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  At 1.8kg/person/day
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Electrical Power Load</span>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div className={`text-xl font-black font-mono ${powerSurplus < 0 ? "text-red-400" : "text-amber-400"}`}>
                  {powerSurplus >= 0 ? `+${powerSurplus.toFixed(1)}` : powerSurplus.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW Surplus</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Generator: {activeShelter.powerKw} kW
                </div>
              </div>
            </div>

            {/* Deficit Alert Flags */}
            {deficits.length > 0 ? (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/60 text-xs font-mono text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Resupply Triggers Identified:</span>
                </div>
                {deficits.map((d, i) => (
                  <div key={i} className="text-[11px] pl-5">• {d}</div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono text-emerald-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Optimal Safety: Shelter capacity comfortably sustains incoming wave for {durationDays} days.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 3. ML HAZARD FORECASTING ================= */}
      {activeSection === "ML_FORECAST" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div
            className={`lg:col-span-12 p-5 rounded-2xl border shadow-md space-y-4 ${
              isLight
                ? "bg-[#faf8f5] border-[#e8e2d8]"
                : "bg-[#0b1326]/90 border-slate-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/40">
              <div>
                <h3 className="text-base font-bold font-mono uppercase flex items-center gap-2 text-purple-400">
                  <BrainCircuit className="w-5 h-5" />
                  <span>Predictive ML Hazard Forecasting Engine (T+72h Projection)</span>
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  Ensemble Gradient-Boosted Random Forest + LSTM neural projection with 96.8% statistical confidence.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Sector:</span>
                <select
                  value={selectedMlForecast.sector}
                  onChange={(e) => {
                    const found = MOCK_ML_HAZARD_FORECASTS.find((f) => f.sector === e.target.value);
                    if (found) setSelectedMlForecast(found);
                  }}
                  className={`text-xs font-mono px-2.5 py-1.5 rounded-lg border outline-none ${
                    isLight ? "bg-white border-slate-300" : "bg-slate-900 border-slate-700 text-white"
                  }`}
                >
                  {MOCK_ML_HAZARD_FORECASTS.map((f) => (
                    <option key={f.sector} value={f.sector}>
                      {f.sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Metric KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase">Predicted Hazard</span>
                <div className="text-sm font-bold text-red-400 mt-0.5">{selectedMlForecast.predictedHazardType.replace(/_/g, " ")}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase">Surge Probability</span>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">{selectedMlForecast.probabilityPct}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase">Model Confidence</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{selectedMlForecast.confidenceScorePct}% (High)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase">Historical Baseline Delta</span>
                <div className="text-sm font-bold text-amber-400 mt-0.5">+{selectedMlForecast.historicalBaselineVariancePct}% Spike</div>
              </div>
            </div>

            {/* Risk Trajectory Area Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={selectedMlForecast.riskTrajectory}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#e2d9cd" : "#1e293b"} />
                  <XAxis
                    dataKey="hourOffset"
                    tickFormatter={(val) => `T+${val}h`}
                    stroke={isLight ? "#64748b" : "#94a3b8"}
                    fontSize={11}
                  />
                  <YAxis
                    stroke={isLight ? "#64748b" : "#94a3b8"}
                    fontSize={11}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value} / 100`, "Risk Index"]}
                    labelFormatter={(label) => `Time Horizon: T+${label} Hours`}
                    contentStyle={{
                      backgroundColor: isLight ? "#ffffff" : "#0f172a",
                      borderColor: isLight ? "#cbd5e1" : "#334155",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: isLight ? "#0f172a" : "#f8fafc",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="riskIndex"
                    name="Projected Risk Index"
                    stroke="#a855f7"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#riskGrad)"
                  />
                  <Line
                    type="monotone"
                    dataKey="upperBound"
                    name="Upper 95% Confidence"
                    stroke="#f87171"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="lowerBound"
                    name="Lower 95% Confidence"
                    stroke="#38bdf8"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs font-mono text-purple-200 flex items-center justify-between">
              <span>ML Recommended Action: <strong>{selectedMlForecast.recommendedAction}</strong></span>
              <span className="text-[10px] text-purple-400">Lead Time: {selectedMlForecast.leadTimeHours} Hours</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. AUTO POLICY BRIEF DOSSIER ================= */}
      {activeSection === "POLICY_BRIEF" && (
        <div
          className={`p-6 rounded-2xl border shadow-xl space-y-5 print:p-0 print:border-none ${
            isLight
              ? "bg-[#faf8f5] border-[#e8e2d8] text-slate-900"
              : "bg-[#0b1326]/95 border-slate-800 text-slate-100"
          }`}
        >
          {/* Top Actions & Official Seal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/50 print:hidden">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-500 font-bold block">
                NATIONAL DISASTER MANAGEMENT & MOES EXECUTIVE DOSSIER
              </span>
              <h3 className="text-lg font-black font-mono text-white mt-0.5">
                Automated Policy Brief & Situational Dossier Generator
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPolicyBrief}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBrief ? "COPIED" : "COPY BRIEF"}</span>
              </button>

              <button
                onClick={handlePrintBrief}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT / EXPORT PDF</span>
              </button>
            </div>
          </div>

          {/* Formal Dossier Content (Print-Ready) */}
          <div className="space-y-4 font-mono text-xs">
            <div className="border-b border-slate-700/60 pb-3">
              <div className="text-[11px] text-amber-400 font-bold uppercase">DOCUMENT ID: {policyBrief.id}</div>
              <h2 className="text-sm sm:text-base font-black text-white mt-1 uppercase">
                {policyBrief.title}
              </h2>
              <div className="text-slate-400 text-[10px] mt-1">
                Target Authority: {policyBrief.targetAuthority} • Date: {new Date(policyBrief.generatedAt).toUTCString()}
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-1">
              <h4 className="font-bold text-cyan-400 uppercase text-xs">1. Executive Summary</h4>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                {policyBrief.executiveSummary}
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="space-y-1">
              <h4 className="font-bold text-cyan-400 uppercase text-xs">2. Quantitative Situation Audit</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Total Exposed Crew</div>
                  <div className="text-sm font-bold text-white">{policyBrief.keyMetrics.totalExposedPopulation} Personnel</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">High-Risk Wards</div>
                  <div className="text-sm font-bold text-red-400">{policyBrief.keyMetrics.highRiskWardsCount} Sectors</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Resource Readiness</div>
                  <div className="text-sm font-bold text-emerald-400">{policyBrief.keyMetrics.resourceReadinessPct}%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Shelter Capacity Status</div>
                  <div className="text-sm font-bold text-cyan-400">{policyBrief.keyMetrics.safeShelterSurplusDeficit}</div>
                </div>
              </div>
            </div>

            {/* Priority Directives */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-cyan-400 uppercase text-xs">3. Immediate Relocation Directives</h4>
              <div className="space-y-1.5">
                {policyBrief.priorityRelocationDirectives.map((d) => (
                  <div key={d.rank} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500 font-bold text-[10px]">
                      RANK {d.rank}
                    </span>
                    <div>
                      <div className="font-bold text-white text-xs">{d.wardName}</div>
                      <div className="text-slate-300 text-[11px] mt-0.5">{d.actionRequired}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Seal & Signatures */}
            <div className="pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-slate-400">
              <div>
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>NDMA / Madrid Protocol Compliance Certified</span>
                </div>
                <div className="text-slate-500 font-mono mt-0.5">{policyBrief.cryptographicSeal}</div>
              </div>

              <div className="text-right">
                <div className="text-white font-bold">{policyBrief.authorizedSignatory}</div>
                <div className="text-slate-500">Chief Mission Commander • MoES / NCPOR</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
