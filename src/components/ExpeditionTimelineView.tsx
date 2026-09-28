import React, { useState } from "react";
import { MOCK_EXPEDITION_STAGES } from "../data/mockPolarData";
import { MissionStage } from "../types";
import {
  Compass,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  Boxes,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
  FileCheck,
} from "lucide-react";

export const ExpeditionTimelineView: React.FC = () => {
  const [stages] = useState<MissionStage[]>(MOCK_EXPEDITION_STAGES);
  const [selectedStageId, setSelectedStageId] = useState<string>("STG-04");

  const selectedStage = stages.find((s) => s.id === selectedStageId) || stages[3];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black font-mono tracking-tight text-white uppercase">
                Expedition Lifecycle & Stage Timeline
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                9-STAGE MISSION LIFECYCLE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Chronological operational progression from scientific planning at NCPOR Goa to return cargo and ice core delivery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Current Active Phase: <strong>Stage 04 (Polar Transit)</strong></span>
        </div>
      </div>

      {/* HORIZONTAL INTERACTIVE TIMELINE STEPPER */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-3 sm:p-4 overflow-x-auto scrollbar-thin">
        <div className="flex items-center min-w-[900px] justify-between relative py-2">
          {/* Background Connecting Line */}
          <div className="absolute left-6 right-6 top-6 h-0.5 bg-slate-800 -z-0" />

          {stages.map((stg, idx) => {
            const isSelected = stg.id === selectedStageId;
            const isCompleted = stg.status === "COMPLETED";
            const isCurrent = stg.status === "CURRENT";

            return (
              <button
                key={stg.id}
                onClick={() => setSelectedStageId(stg.id)}
                className="group relative z-10 flex flex-col items-center text-center transition flex-1"
              >
                {/* Stage Circle Indicator */}
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-mono font-black transition ${
                    isCompleted
                      ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                      : isCurrent
                      ? "bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_15px_#06b6d4] animate-pulse"
                      : "bg-slate-950 border-slate-700 text-slate-500 group-hover:border-slate-500"
                  } ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950" : ""}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : `0${stg.order}`}
                </div>

                {/* Stage Label */}
                <div className="mt-2 space-y-0.5 max-w-[100px]">
                  <span
                    className={`block text-[10px] font-mono font-bold uppercase truncate ${
                      isSelected
                        ? "text-cyan-300 font-black"
                        : isCurrent
                        ? "text-white font-bold"
                        : isCompleted
                        ? "text-slate-300"
                        : "text-slate-500"
                    }`}
                  >
                    {stg.stageName.replace("_", " ")}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 block">
                    {stg.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DETAILED ACTIVE STAGE DOSSIER */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                STAGE 0{selectedStage.order} OF 09
              </span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  selectedStage.status === "COMPLETED"
                    ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                    : selectedStage.status === "CURRENT"
                    ? "bg-cyan-950 text-cyan-300 border-cyan-500/50 animate-pulse"
                    : "bg-slate-900 text-slate-400 border-slate-700"
                }`}
              >
                {selectedStage.status}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-mono text-white tracking-tight mt-1.5">
              {selectedStage.title}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Timeframe: {selectedStage.timeframe}</span>
            </p>
          </div>

          {/* Logistics Readiness Gauge */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right min-w-[160px]">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Logistics Readiness
            </span>
            <span className="text-2xl font-black font-mono text-cyan-400">
              {selectedStage.logisticsReadinessPct}%
            </span>
            <div className="w-full bg-slate-900 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full"
                style={{ width: `${selectedStage.logisticsReadinessPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2-Column Details: Milestones & Resource Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key Milestones List */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
              <FileCheck className="w-4 h-4" />
              <span>Key Operational Milestones</span>
            </span>
            <div className="space-y-2">
              {selectedStage.keyMilestones.map((ms, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-sans leading-relaxed">{ms}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Metrics & Field Notes */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  Deployed Personnel
                </span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {selectedStage.activePersonnelCount}
                </span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                  <Boxes className="w-3.5 h-3.5 text-cyan-400" />
                  Cargo Movement Volume
                </span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {selectedStage.cargoVolumeTons} MT
                </span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                Mission Command Log:
              </span>
              <p className="text-slate-300 font-mono leading-relaxed">
                “{selectedStage.operationalNotes}”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
