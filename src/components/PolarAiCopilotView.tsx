import React, { useState, useEffect } from "react";
import { AiInsight } from "../types";
import { 
  Sparkles, 
  Send, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  Bot, 
  ChevronRight,
  RefreshCw,
  Search,
  Filter,
  Flame,
  Snowflake
} from "lucide-react";

interface PolarAiCopilotViewProps {
  currentStation: string;
  onExecuteRecommendation?: (actionText: string) => void;
  onNavigateToSimulator?: () => void;
  onNavigateToResupply?: () => void;
}

export const PolarAiCopilotView: React.FC<PolarAiCopilotViewProps> = ({
  currentStation,
  onExecuteRecommendation,
  onNavigateToSimulator,
  onNavigateToResupply,
}) => {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "OBSERVATION" | "PREDICTION" | "RISK" | "RECOMMENDATION">("ALL");
  
  // Custom Commander Query
  const [queryInput, setQueryInput] = useState("");
  const [queryResponse, setQueryResponse] = useState<string | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch("/api/ai/copilot");
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights || []);
      }
    } catch (e) {
      console.error("Failed to load AI copilot insights:", e);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [currentStation]);

  const handleSendQuery = async (promptText?: string) => {
    const textToSend = promptText || queryInput;
    if (!textToSend.trim()) return;

    setQueryLoading(true);
    setQueryResponse(null);
    try {
      const res = await fetch("/api/ai/copilot/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSend, currentStation }),
      });
      if (res.ok) {
        const data = await res.json();
        setQueryResponse(data.answer);
      } else {
        setQueryResponse("Unable to synthesize AI response from expedition telemetry. Check server connection.");
      }
    } catch (e) {
      setQueryResponse("AI Copilot communications timeout. Reverting to satellite store-and-forward queue.");
    } finally {
      setQueryLoading(false);
    }
  };

  const filteredInsights = insights.filter((item) => {
    if (categoryFilter === "ALL") return true;
    return item.category === categoryFilter;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "OBSERVATION":
        return {
          bg: "bg-blue-950/70",
          border: "border-blue-500/40",
          text: "text-blue-400",
          icon: <Search className="w-3.5 h-3.5" />,
        };
      case "PREDICTION":
        return {
          bg: "bg-purple-950/70",
          border: "border-purple-500/40",
          text: "text-purple-300",
          icon: <TrendingUp className="w-3.5 h-3.5" />,
        };
      case "RISK":
        return {
          bg: "bg-rose-950/70",
          border: "border-rose-500/40",
          text: "text-rose-400",
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
        };
      case "RECOMMENDATION":
        return {
          bg: "bg-emerald-950/70",
          border: "border-emerald-500/40",
          text: "text-emerald-400",
          icon: <Lightbulb className="w-3.5 h-3.5" />,
        };
      default:
        return {
          bg: "bg-slate-900",
          border: "border-slate-800",
          text: "text-slate-300",
          icon: <Bot className="w-3.5 h-3.5" />,
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight uppercase font-mono">
                Polar AI Copilot & Mission Situational Awareness
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                GEMINI 3.8 FLASH ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Autonomous cognitive telemetry evaluation: Proactively detects anomalies, models fuel breach horizons, and formulates command directives.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={fetchInsights}
            disabled={loadingInsights}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingInsights ? "animate-spin text-cyan-400" : ""}`} />
            <span>Re-evaluate Telemetry</span>
          </button>
        </div>
      </div>

      {/* Commander Interactive AI Query Console */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Consult Polar AI Copilot (Tactical Command Query)</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Station Context: {currentStation}
          </span>
        </div>

        {/* Quick Question Chips */}
        <div className="flex flex-wrap gap-2 text-[11px]">
          {[
            "Analyze wintering fuel runway for Maitri Base",
            "Evaluate Prydz Bay sea-ice navigation risk for MV Vasiliy",
            "What happens if Katabatic winds reach 65 km/h tonight?",
            "Recommend medical evacuation flight corridors",
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQueryInput(prompt);
                handleSendQuery(prompt);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition font-sans text-left"
            >
              “{prompt}”
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
              placeholder="Ask Polar AI Copilot about mission parameters, fuel depletion, weather risks..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>
          <button
            onClick={() => handleSendQuery()}
            disabled={queryLoading}
            className="px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-900 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm"
          >
            {queryLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Evaluate</span>
          </button>
        </div>

        {/* AI Answer Box */}
        {queryResponse && (
          <div className="mt-3 p-3.5 rounded-lg bg-slate-950 border border-cyan-500/40 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold border-b border-slate-800/80 pb-1.5 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                POLAR COPILOT TACTICAL ASSESSMENT
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="font-sans text-slate-200 leading-relaxed">
              {queryResponse}
            </div>
          </div>
        )}
      </div>

      {/* Proactive Situational Awareness Feeds (Observation -> Evidence -> Predicted Impact -> Recommended Action) */}
      <div className="space-y-3">
        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-[#0b1220] p-1 rounded-lg border border-slate-800 text-xs">
            {(["ALL", "OBSERVATION", "PREDICTION", "RISK", "RECOMMENDATION"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded text-[11px] font-mono font-bold transition ${
                  categoryFilter === cat
                    ? "bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-400">
            {filteredInsights.length} Proactive Directives Active
          </span>
        </div>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInsights.map((item) => {
            const badge = getCategoryBadge(item.category);
            const isExecuted = executedActions[item.id];

            return (
              <div
                key={item.id}
                className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-3 text-slate-200"
              >
                {/* Card Top: Category & Urgency */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${badge.bg} ${badge.border} ${badge.text}`}
                    >
                      {badge.icon}
                      {item.category}
                    </span>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        item.urgency === "CRITICAL"
                          ? "bg-red-950/70 text-red-400 border-red-500/50"
                          : item.urgency === "HIGH"
                          ? "bg-orange-950/70 text-orange-400 border-orange-500/50"
                          : "bg-blue-950/70 text-blue-400 border-blue-500/40"
                      }`}
                    >
                      ● {item.urgency} PRIORITY
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {item.title}
                  </h3>

                  {/* 4-Step Chain of Polar Intelligence */}
                  <div className="mt-3 space-y-2 text-xs">
                    {/* 1. Observation */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
                      <div className="text-[10px] uppercase font-mono font-bold text-slate-400 mb-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        1. Observation
                      </div>
                      <p className="text-slate-200 font-sans leading-relaxed">
                        {item.observation}
                      </p>
                    </div>

                    {/* 2. Evidence */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
                      <div className="text-[10px] uppercase font-mono font-bold text-slate-400 mb-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        2. Telemetry Evidence
                      </div>
                      <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                        {item.evidence}
                      </p>
                    </div>

                    {/* 3. Predicted Impact */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
                      <div className="text-[10px] uppercase font-mono font-bold text-slate-400 mb-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        3. Predicted Impact
                      </div>
                      <p className="text-amber-200/90 font-sans leading-relaxed">
                        {item.predictedImpact}
                      </p>
                    </div>

                    {/* 4. Recommended Action */}
                    <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-2.5">
                      <div className="text-[10px] uppercase font-mono font-bold text-emerald-400 mb-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        4. Recommended Action
                      </div>
                      <p className="text-emerald-100 font-sans font-medium leading-relaxed">
                        {item.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action: Authorize / Execute Directive */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-500">
                    ID: {item.id}
                  </span>

                  <button
                    onClick={() => {
                      setExecutedActions({ ...executedActions, [item.id]: true });
                      if (onExecuteRecommendation) onExecuteRecommendation(item.recommendedAction);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                      isExecuted
                        ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40"
                        : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs"
                    }`}
                  >
                    {isExecuted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Directive Authorized</span>
                      </>
                    ) : (
                      <>
                        <span>Authorize Directive</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
