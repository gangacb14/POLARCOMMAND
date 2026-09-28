import React, { useState } from "react";
import { MOCK_MORNING_BRIEF } from "../data/mockPolarData";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Radio,
  ExternalLink,
} from "lucide-react";

interface MorningBriefModalProps {
  onClose: () => void;
  onNavigate: (tabId: any) => void;
}

export const MorningBriefModal: React.FC<MorningBriefModalProps> = ({
  onClose,
  onNavigate,
}) => {
  const brief = MOCK_MORNING_BRIEF;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not available in this environment.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(brief.audioBriefingScript);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#0b1220] border border-cyan-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Polar Accent */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-[#0d1829] to-cyan-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black font-mono tracking-tight text-white uppercase">
                  60-Second Expedition Brief
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                  AI SYNTHESIS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">{brief.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeech}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1 font-mono transition ${
                isPlayingAudio
                  ? "bg-cyan-950 text-cyan-300 border-cyan-500 animate-pulse"
                  : "bg-slate-900 text-slate-400 hover:text-white border-slate-700"
              }`}
              title={isPlayingAudio ? "Stop audio briefing" : "Play audio briefing"}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-cyan-400" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlayingAudio ? "Mute" : "Listen"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-200">
          {/* Executive KPI Status Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{brief.summaryBadges.stableOps} Operations</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Status: Stable</div>
            </div>

            <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-mono font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{brief.summaryBadges.inventoryConcerns} Inventory</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Attention Required</div>
            </div>

            <div className="bg-slate-950/80 border border-orange-500/30 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-400 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{brief.summaryBadges.cargoDelays} Cargo Delay</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Prydz Bay Sea Ice</div>
            </div>

            <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>{brief.summaryBadges.weatherRisks} Weather Risk</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Katabatic Blizzard</div>
            </div>
          </div>

          {/* Top Priority Block */}
          <div className="bg-gradient-to-br from-red-950/40 to-slate-950 border border-red-500/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                TOP PRIORITY
              </span>
              <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {brief.topPriority.timeHorizon}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {brief.topPriority.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {brief.topPriority.description}
            </p>
          </div>

          {/* Recommended Action Block */}
          <div className="bg-slate-950 border border-cyan-500/40 rounded-xl p-4 space-y-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              RECOMMENDED ACTION
            </span>
            <p className="text-xs font-medium text-slate-200">
              “{brief.recommendedAction.directive}”
            </p>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Predicted Impact: {brief.recommendedAction.impact}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition"
          >
            Dismiss Brief
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigate(brief.recommendedAction.targetTab);
            }}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-lg shadow-cyan-950"
          >
            <span>Execute Recommendation (Open Simulator)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
