import React, { useState, useEffect } from "react";
import { SimulationResult, OperationalState } from "../types";
import { 
  Play, 
  RotateCcw, 
  Sliders, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  Fuel, 
  Boxes, 
  Users, 
  TrendingDown, 
  CheckCircle, 
  FileText, 
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";

export const ExpeditionSimulatorView: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>("VESSEL_DELAY_5D");
  
  // Simulation Input Parameters
  const [vesselDelayDays, setVesselDelayDays] = useState<number>(5);
  const [fuelBurnMultiplier, setFuelBurnMultiplier] = useState<number>(1.2);
  const [weatherSeverity, setWeatherSeverity] = useState<"NORMAL" | "MODERATE_STORM" | "SEVERE_BLIZZARD" | "WHITE_OUT">("SEVERE_BLIZZARD");
  const [evacHeadcount, setEvacHeadcount] = useState<number>(0);
  const [isolatedStation, setIsolatedStation] = useState<string>("MAITRI");

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const PRESETS = [
    {
      id: "VESSEL_DELAY_5D",
      name: "Scenario 1: Vessel Delayed by 5 Days",
      desc: "Simulate impact of pack-ice hold-up on MV Vasiliy Golovnin delivery window.",
      delay: 5,
      burn: 1.0,
      weather: "MODERATE_STORM" as const,
      evac: 0,
    },
    {
      id: "FUEL_BURN_20PCT",
      name: "Scenario 2: Fuel Consumption +20%",
      desc: "Simulate prolonged heating draw due to intense polar vortex temperatures.",
      delay: 0,
      burn: 1.2,
      weather: "SEVERE_BLIZZARD" as const,
      evac: 0,
    },
    {
      id: "STATION_ISOLATED",
      name: "Scenario 3: Station Inaccessible / Storm Isolation",
      desc: "Simulate complete 14-day logistical isolation of Maitri Station.",
      delay: 14,
      burn: 1.35,
      weather: "WHITE_OUT" as const,
      evac: 0,
    },
    {
      id: "EVAC_10_CREW",
      name: "Scenario 4: 10 Personnel Emergency Evac",
      desc: "Simulate rapid medical/tactical air evacuation requiring high-fuel sortie sorties.",
      delay: 3,
      burn: 1.4,
      weather: "SEVERE_BLIZZARD" as const,
      evac: 10,
    },
  ];

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setSelectedPreset(preset.id);
    setVesselDelayDays(preset.delay);
    setFuelBurnMultiplier(preset.burn);
    setWeatherSeverity(preset.weather);
    setEvacHeadcount(preset.evac);
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/simulation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: selectedPreset,
          vesselDelayDays,
          fuelBurnMultiplier,
          weatherSeverity,
          evacHeadcount,
          isolatedStation,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (e) {
      console.error("Simulation run error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [vesselDelayDays, fuelBurnMultiplier, weatherSeverity, evacHeadcount, isolatedStation]);

  const getRiskBadge = (state: OperationalState) => {
    switch (state) {
      case "STABLE":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-500/50";
      case "ATTENTION":
        return "bg-amber-950/60 text-amber-400 border-amber-500/50";
      case "HIGH_RISK":
        return "bg-orange-950/60 text-orange-400 border-orange-500/50";
      case "CRITICAL":
        return "bg-red-950/60 text-red-400 border-red-500/50 animate-pulse";
    }
  };

  return (
    <div className="space-y-4 text-slate-200">
      {/* Header */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-400">
            <Sliders className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight uppercase font-mono">
                Expedition What-If Simulator (Digital Twin Stress Test)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                ISOLATED SANDBOX
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Simulate hypothetical operational stress scenarios without mutating live polar telemetry or inventory records.
            </p>
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition shadow-sm self-end md:self-center"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Execute Simulation</span>
        </button>
      </div>

      {/* Preset Scenario Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                isSelected
                  ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg"
                  : "bg-[#0b1220] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-white line-clamp-1">{preset.name}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {preset.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Simulation Controls & Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Parametric Sliders */}
        <div className="lg:col-span-4 bg-[#0b1220] border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Hypothetical Variables
            </span>
            <button
              onClick={() => {
                setVesselDelayDays(0);
                setFuelBurnMultiplier(1.0);
                setWeatherSeverity("NORMAL");
                setEvacHeadcount(0);
                setSelectedPreset("CUSTOM");
              }}
              className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Slider 1: Vessel Delay */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Cargo Vessel Delay:</span>
              <span className="font-mono font-bold text-amber-400">+{vesselDelayDays} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={vesselDelayDays}
              onChange={(e) => {
                setVesselDelayDays(Number(e.target.value));
                setSelectedPreset("CUSTOM");
              }}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>On Schedule (0d)</span>
              <span>Extreme (+20d)</span>
            </div>
          </div>

          {/* Slider 2: Fuel Burn Multiplier */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Station Fuel Consumption:</span>
              <span className="font-mono font-bold text-red-400">
                {fuelBurnMultiplier.toFixed(2)}x ({Math.round((fuelBurnMultiplier - 1.0) * 100)}% extra)
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.2"
              step="0.05"
              value={fuelBurnMultiplier}
              onChange={(e) => {
                setFuelBurnMultiplier(Number(e.target.value));
                setSelectedPreset("CUSTOM");
              }}
              className="w-full accent-red-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Nominal (1.0x)</span>
              <span>Maximum Draw (2.2x)</span>
            </div>
          </div>

          {/* Select: Weather Severity */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium block">
              Weather Severity Profile:
            </label>
            <select
              value={weatherSeverity}
              onChange={(e) => {
                setWeatherSeverity(e.target.value as any);
                setSelectedPreset("CUSTOM");
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            >
              <option value="NORMAL">Normal Polar Wintering (-25°C, 25 km/h)</option>
              <option value="MODERATE_STORM">Moderate Gale Storm (-32°C, 45 km/h)</option>
              <option value="SEVERE_BLIZZARD">Severe Katabatic Blizzard (-38°C, 65 km/h)</option>
              <option value="WHITE_OUT">Total Whiteout Polar Vortex (-45°C, 90 km/h)</option>
            </select>
          </div>

          {/* Slider 3: Evacuation Headcount */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Emergency Evacuation Headcount:</span>
              <span className="font-mono font-bold text-rose-400">{evacHeadcount} Personnel</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={evacHeadcount}
              onChange={(e) => {
                setEvacHeadcount(Number(e.target.value));
                setSelectedPreset("CUSTOM");
              }}
              className="w-full accent-rose-400"
            />
          </div>

          {/* Target Station */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium block">
              Isolated Station Focus:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsolatedStation("MAITRI")}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
                  isolatedStation === "MAITRI"
                    ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/50"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                Maitri Base
              </button>
              <button
                type="button"
                onClick={() => setIsolatedStation("BHARATI")}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition border ${
                  isolatedStation === "BHARATI"
                    ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/50"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                Bharati Base
              </button>
            </div>
          </div>
        </div>

        {/* Right: Side-by-Side Comparison (CURRENT PLAN vs SIMULATED SCENARIO) */}
        <div className="lg:col-span-8 bg-[#0b1220] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  Comparative Digital Twin Evaluation
                </span>
                <h3 className="text-base font-bold text-white">
                  {simulationResult?.name || "Scenario Assessment"}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                Mode: What-If Delta Analysis
              </span>
            </div>

            {/* Side-by-Side Dual Metric Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column A: CURRENT PLAN */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Current Base Plan
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskBadge(simulationResult?.currentPlan.missionRiskLevel || "ATTENTION")}`}>
                    ● {simulationResult?.currentPlan.missionRiskLevel || "ATTENTION"}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-amber-400" /> Fuel Runway
                    </span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {simulationResult?.currentPlan.fuelRunwayDays || 156} Days
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Boxes className="w-3.5 h-3.5 text-cyan-400" /> Inventory Autonomy
                    </span>
                    <span className="font-bold text-slate-200 text-sm">
                      {simulationResult?.currentPlan.inventoryAutonomyDays || 180} Days
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Critical Shortage Date
                    </span>
                    <span className="font-bold text-slate-300">
                      {simulationResult?.currentPlan.criticalShortageDate || "2027-02-28"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-cyan-400" /> Personnel Safety Margin
                    </span>
                    <span className="font-bold text-emerald-400">
                      {simulationResult?.currentPlan.personnelSafetyMarginPct || 92}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Column B: SIMULATED SCENARIO */}
              <div className="bg-indigo-950/20 border border-indigo-500/40 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
                  <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    Simulated Stress Outcome
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskBadge(simulationResult?.simulatedScenario.missionRiskLevel || "HIGH_RISK")}`}>
                    ● {simulationResult?.simulatedScenario.missionRiskLevel || "HIGH_RISK"}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-amber-400" /> Fuel Runway
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold text-sm ${
                        (simulationResult?.simulatedScenario.fuelRunwayDays || 98) < 60 ? "text-red-400" : "text-amber-400"
                      }`}>
                        {simulationResult?.simulatedScenario.fuelRunwayDays || 98} Days
                      </span>
                      <span className="text-[11px] text-red-400">
                        (-{(simulationResult?.currentPlan.fuelRunwayDays || 156) - (simulationResult?.simulatedScenario.fuelRunwayDays || 98)}d)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Boxes className="w-3.5 h-3.5 text-cyan-400" /> Inventory Autonomy
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-amber-300 text-sm">
                        {simulationResult?.simulatedScenario.inventoryAutonomyDays || 120} Days
                      </span>
                      <span className="text-[11px] text-red-400">
                        (-{(simulationResult?.currentPlan.inventoryAutonomyDays || 180) - (simulationResult?.simulatedScenario.inventoryAutonomyDays || 120)}d)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Critical Shortage Date
                    </span>
                    <span className="font-bold text-red-400">
                      {simulationResult?.simulatedScenario.criticalShortageDate || "2026-12-14"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-rose-400" /> Personnel Safety Margin
                    </span>
                    <span className={`font-bold ${
                      (simulationResult?.simulatedScenario.personnelSafetyMarginPct || 74) < 70 ? "text-red-400" : "text-amber-400"
                    }`}>
                      {simulationResult?.simulatedScenario.personnelSafetyMarginPct || 74}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Shortages & Mitigation Directives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Predicted Critical Shortages */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Identified Critical Bottlenecks:
                </div>
                {simulationResult?.simulatedScenario.criticalShortagesList && simulationResult.simulatedScenario.criticalShortagesList.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {simulationResult.simulatedScenario.criticalShortagesList.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-400">No critical resource deficits projected under this stress load.</p>
                )}
              </div>

              {/* Recommended Mitigation Directives */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Recommended Mitigation Directives:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {simulationResult?.simulatedScenario.mitigationDirectives?.map((dir, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">→</span>
                      <span>{dir}</span>
                    </li>
                  )) || (
                    <li className="text-slate-400">Run simulation to generate tactical commander directives.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
