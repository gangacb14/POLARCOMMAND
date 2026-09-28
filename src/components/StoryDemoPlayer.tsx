import React, { useState, useEffect } from "react";
import {
  PlayCircle,
  PauseCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { CommandTab } from "./CommandNav";

export interface DemoStep {
  stepNumber: number;
  title: string;
  summary: string;
  tab: CommandTab;
  actionCallout: string;
  triggerEmergency?: boolean;
  triggerReport?: boolean;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: "Step 1 — Commander opens POLAR COMMAND",
    summary: "The platform boots into the deep black Command Center headquarters with real-time mission telemetry, health indexes, and proactive status badges.",
    tab: "mission-control",
    actionCallout: "Examining overall expedition status and opening Commander's 60-second brief.",
  },
  {
    stepNumber: 2,
    title: "Step 2 — Digital Twin shows the complete expedition",
    summary: "The interactive polar map projects all 5 research stations, 3 vessels, overland heavy convoys, field teams, and dynamic sea ice thickness.",
    tab: "digital-twin",
    actionCallout: "Visualizing geospatial nodes across Antarctica (Maitri, Bharati, DG) and Arctic (Himadri, IndARC).",
  },
  {
    stepNumber: 3,
    title: "Step 3 — AI identifies fuel consumption is increasing",
    summary: "Neural telemetry monitoring flags thermal power generation surges at Bharati Station due to extreme coastal winds.",
    tab: "resource-intelligence",
    actionCallout: "Reviewing Resource Digital Twin: Polar diesel burn rate accelerated to 420 L/day.",
  },
  {
    stepNumber: 4,
    title: "Step 4 — Weather intelligence detects storm on resupply route",
    summary: "The Weather Impact Engine detects a 68 km/h blizzard and 88% sea-ice compaction along Maritime Route 02 in Prydz Bay.",
    tab: "weather-impact",
    actionCallout: "Translating environmental data into logistics risks: Cargo Route 03 HIGH RISK, vessel transit choked.",
  },
  {
    stepNumber: 5,
    title: "Step 5 — System predicts current fuel supply may become critical",
    summary: "Stockout forecasting calculates that Bharati fuel reserves will reach the 5-day mandatory safety threshold within 48 hours.",
    tab: "ai-copilot",
    actionCallout: "AI Copilot issues proactive prediction: Stockout horizon 6.4 days without resupply intervention.",
  },
  {
    stepNumber: 6,
    title: "Step 6 — AI recommends an alternative resupply plan",
    summary: "AI generates an autonomous logistics recommendation: Reroute heavy sledge convoy from DG depot and throttle non-vital greenhouse loads.",
    tab: "ai-copilot",
    actionCallout: "Reviewing AI recommendation to shift 180 MT of polar diesel via overland PistenBully convoy.",
  },
  {
    stepNumber: 7,
    title: "Step 7 — Commander opens EXPEDITION SIMULATOR",
    summary: "The What-If Parametric Simulator allows the commander to model delays, storm intensity, and resource consumption horizons.",
    tab: "simulator",
    actionCallout: "Accessing the parametric simulation matrix.",
  },
  {
    stepNumber: 8,
    title: "Step 8 — Simulate a 5-day cargo delay",
    summary: "Commander adjusts the maritime icebreaker arrival slider to inject a +5 day delay due to Prydz Bay ice pack compaction.",
    tab: "simulator",
    actionCallout: "Setting delay slider to +5 Days to observe system resilience.",
  },
  {
    stepNumber: 9,
    title: "Step 9 — System shows the predicted impact",
    summary: "Comparative analytical charts show unmitigated stockout at day 8.2 vs. baseline requirements.",
    tab: "simulator",
    actionCallout: "Evaluating fuel runway contraction and safety margin breach warnings.",
  },
  {
    stepNumber: 10,
    title: "Step 10 — Commander accepts a revised logistics plan",
    summary: "Commander applies the simulated mitigation plan, extending fuel autonomy from 6.4 days to 14.8 days.",
    tab: "simulator",
    actionCallout: "Logistics revision locked and broadcast to station logistics officers.",
  },
  {
    stepNumber: 11,
    title: "Step 11 — An emergency is simulated at a field camp",
    summary: "A priority distress beacon is received: Field Camp 03 reports acute medical trauma and satellite antenna failure in a blizzard.",
    tab: "emergency-command",
    triggerEmergency: true,
    actionCallout: "System automatically transforms into DEFCON-1 Emergency Command Mode.",
  },
  {
    stepNumber: 12,
    title: "Step 12 — Emergency Command identifies affected personnel & routes",
    summary: "Tactical map isolates Field Camp 03 (6 glaciologists), nearest response team (Team Bravo 18.4 km away), and ground-radar cleared Route B.",
    tab: "emergency-command",
    triggerEmergency: true,
    actionCallout: "Crevasse danger zone highlighted in red; safe Route B plotted in glowing green.",
  },
  {
    stepNumber: 13,
    title: "Step 13 — AI generates an emergency response plan",
    summary: "AI Response Planner autonomously constructs a 6-step rescue sequence, calculates 42-minute response horizon, and verifies required medical packs.",
    tab: "emergency-command",
    triggerEmergency: true,
    actionCallout: "Reviewing AI Rescue Plan: Deploy Team Bravo + Snowcat V-04 + Route B + 6 Trauma Kits.",
  },
  {
    stepNumber: 14,
    title: "Step 14 — Commander approves the response",
    summary: "Commander reviews directives, signs the operational order, and dispatches the Quick Reaction Force.",
    tab: "emergency-command",
    triggerEmergency: true,
    actionCallout: "Commander authorizes dispatch; Snowcat V-04 mobilizes along Route B.",
  },
  {
    stepNumber: 15,
    title: "Step 15 — System generates an expedition status report",
    summary: "An official mission status report is compiled with all operational metrics, safety approvals, and resource projections ready for NCPOR/MoES sign-off.",
    tab: "reports",
    triggerReport: true,
    actionCallout: "Formal SIH 2026 mission dossier generated with complete audit trail.",
  },
];

interface StoryDemoPlayerProps {
  onClose: () => void;
  onNavigateTab: (tab: CommandTab) => void;
  onSetEmergencyActive: (active: boolean) => void;
  onOpenReportModal: () => void;
}

export const StoryDemoPlayer: React.FC<StoryDemoPlayerProps> = ({
  onClose,
  onNavigateTab,
  onSetEmergencyActive,
  onOpenReportModal,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const step = DEMO_STEPS[currentStepIdx];

  // Apply step actions on change
  useEffect(() => {
    onNavigateTab(step.tab);
    if (step.triggerEmergency) {
      onSetEmergencyActive(true);
    }
    if (step.triggerReport) {
      onOpenReportModal();
    }
  }, [currentStepIdx]);

  // Auto play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < DEMO_STEPS.length - 1) {
            return prev + 1;
          } else {
            setIsAutoPlaying(false);
            return prev;
          }
        });
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleNext = () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="bg-[#050b14]/95 border-2 border-cyan-500 rounded-xl p-3 sm:p-4 shadow-2xl shadow-cyan-950/60 backdrop-blur-md space-y-3">
      {/* Top Header of the Story Controller */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black font-mono tracking-tight text-white uppercase">
                SIH 2026 Interactive Demonstration Story
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                STEP {step.stepNumber} OF 15
              </span>
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 transition border ${
              isAutoPlaying
                ? "bg-amber-950 text-amber-300 border-amber-500 animate-pulse"
                : "bg-slate-900 text-slate-300 border-slate-700 hover:text-white"
            }`}
          >
            {isAutoPlaying ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
            <span>{isAutoPlaying ? "Pause Tour" : "Auto Play"}</span>
          </button>

          <button
            onClick={() => setCurrentStepIdx(0)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition border border-slate-800"
            title="Restart demo from Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close guided tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Description Box */}
      <div className="bg-slate-950/80 p-3 rounded-lg border border-cyan-500/30 space-y-1.5">
        <h4 className="text-sm font-mono font-black text-cyan-300">
          {step.title}
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          {step.summary}
        </p>
        <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 pt-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Active Demonstration: {step.actionCallout}</span>
        </div>
      </div>

      {/* Progress Dots Bar & Navigation */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 border border-slate-800 text-xs font-mono flex items-center gap-1 transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {/* 15 mini step dots */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStepIdx(idx)}
              className={`w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center transition ${
                idx === currentStepIdx
                  ? "bg-cyan-500 text-slate-950 scale-110 ring-2 ring-cyan-400"
                  : idx < currentStepIdx
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                  : "bg-slate-900 text-slate-500 border border-slate-800"
              }`}
            >
              {s.stepNumber}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentStepIdx === DEMO_STEPS.length - 1}
          className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white font-mono font-bold text-xs flex items-center gap-1 transition shadow-sm"
        >
          <span>Next Step</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
