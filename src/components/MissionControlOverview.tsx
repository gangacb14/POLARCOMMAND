import React from "react";
import {
  MOCK_STATIONS,
  MOCK_VESSELS,
  MOCK_PERSONNEL_GROUPS,
  MOCK_WEATHER_IMPACTS,
} from "../data/mockPolarData";
import { useTranslation } from "../i18n";
import {
  LayoutDashboard,
  Globe2,
  Ship,
  Users,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Wind,
  Fuel,
  HeartPulse,
  Radio,
  Sparkles,
  ArrowRight,
  Navigation,
  Sliders,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { CommandTab } from "./CommandNav";

interface MissionControlOverviewProps {
  onNavigateTab: (tab: CommandTab) => void;
  onOpenMorningBrief: () => void;
  onOpenStoryDemo: () => void;
}

export const MissionControlOverview: React.FC<MissionControlOverviewProps> = ({
  onNavigateTab,
  onOpenMorningBrief,
  onOpenStoryDemo,
}) => {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Top Commander Hero Banner */}
      <div className="bg-[#0b1220] border border-cyan-500/30 rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              {language === "hi" ? "ध्रुवीय कमान मुख्यालय • 44वां आईएई" : "POLAR COMMAND HQ • 44TH IAE"}
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {t("All 5 Continental Nodes Telemetry Online")}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
            {t("Polar Expedition Digital Twin & Mission Intelligence")}
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl font-sans">
            {t("Autonomous situational awareness integrating geospatial digital twins, real-time burn-rate forecasting, multi-stage expedition timelines, and predictive AI emergency decision support.")}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenMorningBrief}
            className="px-3 py-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/50 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>{t("60-Sec Brief")}</span>
          </button>

          <button
            onClick={() => onNavigateTab("simulator")}
            className="px-3 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>{t("What-If Simulator")}</span>
          </button>

          <button
            onClick={() => onNavigateTab("emergency-command")}
            className="px-3 py-2 rounded-lg bg-red-950 hover:bg-red-900 text-red-200 border border-red-500/60 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{t("EMERGENCY COMMAND")}</span>
          </button>
        </div>
      </div>

      {/* 5 Polar Research Stations Telemetry Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <span>{language === "hi" ? "5 स्थायी ध्रुवीय अनुसंधान स्टेशन एवं डिपो" : "5 Permanent Polar Stations & Depots"}</span>
          </span>
          <button
            onClick={() => onNavigateTab("digital-twin")}
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <span>{language === "hi" ? "भू-स्थानिक ट्विन खोलें" : "Open Geospatial Twin"}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {MOCK_STATIONS.map((st) => (
            <div
              key={st.id}
              onClick={() => onNavigateTab("digital-twin")}
              className="bg-[#0b1220] border border-slate-800 hover:border-cyan-500/60 rounded-xl p-3.5 transition cursor-pointer shadow-lg space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-white truncate">
                  {st.code}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    st.status === "STABLE"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                      : "bg-amber-950 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {t(st.status)}
                </span>
              </div>

              <div className="text-[11px] text-slate-300 font-sans truncate">
                {t(st.name)}
              </div>

              {/* Resource Bars */}
              <div className="space-y-1 text-[10px] font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>{t("Fuel")}</span>
                  <span className={st.fuelPct < 60 ? "text-amber-400 font-bold" : "text-slate-200"}>
                    {st.fuelPct}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      st.fuelPct < 60 ? "bg-amber-400" : "bg-cyan-400"
                    }`}
                    style={{ width: `${st.fuelPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-slate-400 pt-0.5">
                  <span>{t("Personnel")}</span>
                  <span className="text-slate-200 font-bold">{st.currentPersonnel}</span>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>{st.weather.tempC}°C</span>
                <span className="truncate max-w-[90px]">{t(st.weather.condition)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Operational Intelligence: Vessels & Weather vs Field Personnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Active Polar Fleet & Weather Advisory (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* Vessels Box */}
          <div className="bg-[#0b1220] border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Ship className="w-4 h-4 text-cyan-400" />
                <span>{language === "hi" ? "सक्रिय ध्रुवीय अभियान बेड़ा" : "Active Polar Expedition Fleet"}</span>
              </span>
              <button
                onClick={() => onNavigateTab("route-intelligence")}
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>{language === "hi" ? "मार्ग खुफिया" : "Route Intel"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {MOCK_VESSELS.map((ves) => (
                <div
                  key={ves.id}
                  className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 flex items-start justify-between gap-2 text-xs font-mono"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{t(ves.name)}</span>
                      <span className="text-[10px] text-slate-400">[{ves.callsign}]</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                      {language === "hi" ? "गंतव्य:" : "Dest:"} <strong className="text-slate-200">{t(ves.destination)}</strong>
                    </p>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>{language === "hi" ? "गति" : "Speed"}: {ves.speedKt} kt</span>
                      <span>•</span>
                      <span>{language === "hi" ? "बर्फ सघनता" : "Ice Pack"}: {ves.icePackDensityPct}%</span>
                      <span>•</span>
                      <span>ETA: {ves.etaDays} {language === "hi" ? "दिन" : "Days"}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border uppercase shrink-0 ${
                      ves.status === "EN_ROUTE"
                        ? "bg-cyan-950 text-cyan-300 border-cyan-500/40"
                        : "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                    }`}
                  >
                    {language === "hi" ? (ves.status === "EN_ROUTE" ? "मार्ग में" : "पहुंच गया") : ves.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Katabatic Weather Warning */}
          <div className="bg-gradient-to-r from-red-950/30 to-[#0b1220] border border-red-500/40 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-red-400" />
                <span>{language === "hi" ? "ज़ोन 02 गंभीर कैटाबैटिक बर्फ़ीला तूफ़ान चेतावनी" : "Zone 02 Severe Katabatic Blizzard Alert"}</span>
              </span>
              <button
                onClick={() => onNavigateTab("weather-impact")}
                className="text-[10px] font-mono text-red-300 hover:underline"
              >
                {language === "hi" ? "रसद प्रभाव देखें →" : "View Logistics Impact →"}
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {language === "hi"
                ? "शिरमाकर नखलिस्तान और महाद्वीपीय पठार के बीच 74 किमी/घंटा की गति से हवाएं और -28.6°C विंडचिल। बाहरी ट्रेवर्स केवल सुरक्षा लाइनों के साथ अनुमत।"
                : "Wind speeds gusting to 74 km/h with windchill at -28.6°C between Schirmacher Oasis and continental plateau. Outdoor traverses restricted to tethered lifelines."}
            </p>
          </div>
        </div>

        {/* Right: Active Field Teams Safety & Movement (6 cols) */}
        <div className="lg:col-span-6 bg-[#0b1220] border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{language === "hi" ? "कार्मिक फील्ड समूह एवं सुरक्षा स्थिति" : "Personnel Field Groups & Safety Status"}</span>
            </span>
            <button
              onClick={() => onNavigateTab("personnel")}
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>{language === "hi" ? "कार्मिक ट्विन" : "Personnel Twin"}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {MOCK_PERSONNEL_GROUPS.map((grp) => (
              <div
                key={grp.id}
                onClick={() => onNavigateTab("personnel")}
                className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 hover:border-cyan-500/50 cursor-pointer transition flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{t(grp.name)}</span>
                    <span className="text-[11px] text-slate-400">({grp.personnelCount} {language === "hi" ? "व्यक्ति" : "Pers"})</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5 truncate max-w-xs font-sans">
                    {t(grp.currentLocation)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                    <span>{language === "hi" ? "संचार:" : "Comm:"} {t(grp.communicationStatus)}</span>
                    <span>•</span>
                    <span>{language === "hi" ? "वापसी:" : "Return:"} {grp.returnWindowHours}h {language === "hi" ? "विंडो" : "window"}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                    grp.safetyStatus === "OPTIMAL"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                      : grp.safetyStatus === "CAUTION"
                      ? "bg-amber-950 text-amber-300 border-amber-500/40"
                      : "bg-red-950 text-red-300 border-red-500/50 animate-pulse"
                  }`}
                >
                  {t(grp.safetyStatus)}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Resupply Callout */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === "hi" ? "भारती ईंधन रनवे: 6.4 दिन" : "Bharati Fuel Runway: 6.4 Days"}</span>
            </span>
            <button
              onClick={() => onNavigateTab("resource-intelligence")}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
            >
              <span>{language === "hi" ? "संसाधन ट्विन्स का निरीक्षण करें" : "Inspect Resource Twins"}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
