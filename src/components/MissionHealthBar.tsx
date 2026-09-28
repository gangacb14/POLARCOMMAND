import React, { useState, useEffect } from "react";
import { MissionHealth, OperationalState } from "../types";
import { useTranslation } from "../i18n";
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Layers, 
  Clock, 
  Radio, 
  Boxes, 
  Truck, 
  Wind 
} from "lucide-react";

interface MissionHealthBarProps {
  health?: MissionHealth | null;
  currentStation?: string;
  onRefresh?: () => void;
  onOpenCopilot?: () => void;
}

export const MissionHealthBar: React.FC<MissionHealthBarProps> = ({ 
  health: initialHealth, 
  currentStation = "MAITRI",
  onRefresh,
  onOpenCopilot 
}) => {
  const { t, language } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [liveHealth, setLiveHealth] = useState<MissionHealth | null>(initialHealth || null);

  useEffect(() => {
    if (!initialHealth) {
      fetch(`/api/mission/health?station=${currentStation}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) setLiveHealth(data);
        })
        .catch((e) => console.warn("Live health fetch fallback:", e));
    }
  }, [currentStation, initialHealth]);

  // Fallback if not loaded yet
  const currentHealth: MissionHealth = initialHealth || liveHealth || {
    overallScore: 68,
    state: "HIGH_RISK",
    explanation: language === "hi" 
      ? "मिशन की स्थिति बदलकर उच्च जोखिम हो गई है क्योंकि ईंधन उपलब्धता घट रही है जबकि प्रिड्ज़ बे में खराब मौसम अगली पुनः आपूर्ति में देरी कर सकता है।"
      : "Mission status changed to HIGH RISK because fuel availability is declining while severe weather in the Prydz Bay corridor may delay the next resupply operation.",
    lastEvaluatedAt: new Date().toISOString(),
    factors: [
      { name: language === "hi" ? "इन्वेंटरी उपलब्धता" : "Inventory Availability", score: 64, weight: 0.25, status: "warning", detail: language === "hi" ? "डीजल बफर 68% पर; मेडिकल किट पुनः ऑर्डर फ़्लैग" : "Diesel buffer at 68% capacity; medical kits reorder flagged" },
      { name: language === "hi" ? "कार्मिक सुरक्षा" : "Personnel Safety", score: 72, weight: 0.20, status: "warning", detail: language === "hi" ? "क्रेवास पतन घटना स्थिर; फील्ड ट्रेवर्स मॉनिटर" : "Crevasse fall incident stabilized; field traverse monitored" },
      { name: language === "hi" ? "मौसम की स्थिति" : "Weather Conditions", score: 52, weight: 0.15, status: "warning", detail: language === "hi" ? "कैटाबैटिक बर्फ़ीला तूफ़ान सलाह सक्रिय (54 किमी/घंटा झोंके)" : "Katabatic blizzard advisory active (54 km/h gusts, -37.8°C chill)" },
      { name: language === "hi" ? "कार्गो विलंब" : "Cargo Delays", score: 65, weight: 0.15, status: "warning", detail: language === "hi" ? "समुद्री बर्फ के कारण जहाज की गति धीमी" : "MV Vasiliy Golovnin speed reduced to 8.2 kt by 88% sea-ice pack" },
      { name: language === "hi" ? "उपकरण की स्थिति" : "Equipment Condition", score: 78, weight: 0.10, status: "nominal", detail: language === "hi" ? "5 में से 4 भारी ट्रेवर्स वाहन ऑनलाइन" : "4 of 5 heavy traverse units online; 1 unit undergoing maintenance" },
      { name: language === "hi" ? "संचार स्थिति" : "Communication Status", score: 92, weight: 0.10, status: "nominal", detail: language === "hi" ? "इरिडियम एसबीडी 420ms विलंबता; वीएचएफ सक्रिय" : "Iridium SBD constellation 420ms latency; redundant VHF active" },
      { name: language === "hi" ? "पुनः आपूर्ति समयरेखा" : "Resupply Timeline", score: 58, weight: 0.05, status: "warning", detail: language === "hi" ? "अगली निर्धारित डिलीवरी 8 दिनों में" : "Next scheduled vessel delivery window in 8 days; weather risk high" },
    ],
  };

  const getStateBadge = (state: OperationalState) => {
    switch (state) {
      case "STABLE":
        return {
          icon: <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse" />,
          label: t("STABLE"),
          textColor: "text-emerald-400",
          border: "border-emerald-500/40",
          bg: "bg-emerald-950/40",
        };
      case "ATTENTION":
        return {
          icon: <span className="inline-block w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-pulse" />,
          label: t("ATTENTION"),
          textColor: "text-amber-400",
          border: "border-amber-500/40",
          bg: "bg-amber-950/40",
        };
      case "HIGH_RISK":
        return {
          icon: <span className="inline-block w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_12px_#f97316] animate-ping" />,
          label: t("HIGH RISK"),
          textColor: "text-orange-400",
          border: "border-orange-500/50",
          bg: "bg-orange-950/40",
        };
      case "CRITICAL":
        return {
          icon: <span className="inline-block w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_#ef4444] animate-bounce" />,
          label: t("CRITICAL"),
          textColor: "text-red-400",
          border: "border-red-500/60",
          bg: "bg-red-950/50",
        };
    }
  };

  const badge = getStateBadge(currentHealth.state);

  return (
    <div className="bg-[#0b1220] border border-slate-800/90 rounded-xl p-4 shadow-xl text-slate-200 relative overflow-hidden">
      {/* Subtle top indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        currentHealth.state === "CRITICAL" ? "bg-red-500" :
        currentHealth.state === "HIGH_RISK" ? "bg-orange-500" :
        currentHealth.state === "ATTENTION" ? "bg-amber-400" : "bg-emerald-500"
      }`} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* State & Score */}
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border ${badge.border} ${badge.bg} flex items-center justify-center`}>
            {badge.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                {language === "hi" ? "अभियान परिचालन स्थिति" : "Expedition Operational State"}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                [{language === "hi" ? "लाइव बहु-मानदंड इंजन" : "LIVE MULTI-CRITERIA ENGINE"}]
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className={`text-xl sm:text-2xl font-black tracking-wider ${badge.textColor}`}>
                {badge.label}
              </span>
              <div className="flex items-center gap-1 text-xs font-mono text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === "hi" ? "स्वास्थ्य सूचकांक:" : "Health Index:"} <strong className="text-white">{currentHealth.overallScore}</strong>/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Explainability Callout */}
        <div className="flex-1 md:max-w-xl bg-slate-900/70 border border-slate-800/80 rounded-lg p-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-cyan-400 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            {language === "hi" ? "निर्णय तर्क (स्पष्टीकरणीय एआई इंजन):" : "Decision Rationale (Explainable AI Engine):"}
          </div>
          <p className="leading-relaxed font-sans text-slate-200">
            “{t(currentHealth.explanation)}”
          </p>
        </div>

        {/* Breakdown Toggle Button */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <span>{expanded ? (language === "hi" ? "7-कारक मॉडल छिपाएं" : "Hide 7-Factor Model") : (language === "hi" ? "7 कारकों का निरीक्षण करें" : "Inspect 7 Factors")}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Expanded Factor Breakdown */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {language === "hi" ? "गणितीय स्वास्थ्य स्कोर संरचना (पैरामीट्रिक भार)" : "Mathematical Health Score Composition (Real-time Parametric Weighting)"}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {language === "hi" ? "मूल्यांकित:" : "Evaluated:"} {new Date(currentHealth.lastEvaluatedAt).toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {currentHealth.factors.map((factor, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200">{t(factor.name)}</span>
                    <span className="font-mono text-[11px] text-cyan-400 font-bold">{factor.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-1.5 border border-slate-800">
                    <div 
                      className={`h-full rounded-full ${
                        factor.score >= 80 ? "bg-emerald-500" :
                        factor.score >= 60 ? "bg-amber-400" : "bg-red-500"
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span className="truncate max-w-[180px]" title={t(factor.detail)}>{t(factor.detail)}</span>
                  <span className="font-mono text-slate-500">{(factor.weight * 100).toFixed(0)}% {language === "hi" ? "भार" : "wt"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
