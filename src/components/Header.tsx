import React, { useState, useEffect } from "react";
import { Language, UserRole, AppTheme } from "../types";
import { translations } from "../i18n";
import { PWAInstallButton } from "./PWAInstallButton";
import { 
  Radio, 
  Clock, 
  Eye, 
  Globe, 
  Smartphone, 
  Monitor, 
  AlertOctagon, 
  ShieldCheck, 
  Compass, 
  FileCode,
  UserCheck,
  Palette
} from "lucide-react";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  currentStation: string;
  setCurrentStation: (station: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  onQuickSosClick: () => void;
  onOpenDocs: () => void;
  isOnline: boolean;
  userRole?: UserRole;
  setUserRole?: (role: UserRole) => void;
  theme?: AppTheme;
  setTheme?: (theme: AppTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  highContrast,
  setHighContrast,
  currentStation,
  setCurrentStation,
  activeView,
  setActiveView,
  onQuickSosClick,
  onOpenDocs,
  isOnline,
  userRole = "ADMIN",
  setUserRole,
  theme = "DARK",
  setTheme,
}) => {
  const t = translations[language];
  const isLight = theme === "PASTEL_LIGHT";
  const [utcTime, setUtcTime] = useState("");
  const [istTime, setIstTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + " UTC");
      setIstTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="main-app-header"
      className={`border-b transition-colors ${
        highContrast
          ? "bg-black text-white border-white"
          : isLight
          ? "bg-[#f5efe6]/95 backdrop-blur-md text-slate-800 border-[#ded5c6]"
          : "bg-[#060c18]/95 backdrop-blur-md text-slate-100 border-slate-800"
      } sticky top-0 z-40 px-4 py-2.5 shadow-xl`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Ministry & POLAR COMMAND Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center p-1.5 shadow-xs text-cyan-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-black text-base tracking-wider uppercase flex items-center gap-1.5 font-mono ${isLight ? "text-slate-900" : "text-white"}`}>
                  POLAR COMMAND
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    DISASTER & EXPEDITIONS HQ
                  </span>
                </span>
              </div>
              <p className={`text-[11px] font-mono line-clamp-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                {language === "hi" ? "अखिल भारतीय ध्रुवीय कमान केंद्र एवं आपदा शमन (MoES / NCPOR & SIH 062)" : "MoES / NCPOR Multi-Hazard Disaster Intelligence & Expedition System"}
              </p>
            </div>
          </div>

          {/* Mobile Station & SOS button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-btn-sos"
              onClick={onQuickSosClick}
              className="px-2.5 py-1 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-1 shadow-xs animate-bounce"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              SOS
            </button>
          </div>
        </div>

        {/* Center: Live Station Selector & Telemetry Heartbeat */}
        <div className="flex items-center gap-3 text-xs w-full md:w-auto justify-between md:justify-center overflow-x-auto py-1">
          <div className={`flex items-center gap-1.5 p-1 rounded-lg border ${isLight ? "bg-[#ece4d6] border-[#ded5c6]" : "bg-slate-900/90 border-slate-800"}`}>
            <span className="text-[10px] font-semibold text-slate-400 uppercase px-1 font-mono">
              {language === "hi" ? "स्टेशन:" : "Station:"}
            </span>
            {(["MAITRI", "BHARATI", "HIMADRI"] as const).map((st) => (
              <button
                key={st}
                id={`btn-station-${st.toLowerCase()}`}
                onClick={() => setCurrentStation(st)}
                className={`px-2 py-1 rounded text-xs font-mono font-semibold transition ${
                  currentStation === st
                    ? "bg-cyan-600 text-white shadow-xs"
                    : isLight
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {st === "MAITRI" ? (language === "hi" ? "मैत्री" : "Maitri") : st === "BHARATI" ? (language === "hi" ? "भारती" : "Bharati") : (language === "hi" ? "हिमाद्री" : "Himadri")}
              </button>
            ))}
          </div>

          {/* RBAC Role Selector */}
          {setUserRole && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-mono ${isLight ? "bg-[#ece4d6] border-[#ded5c6]" : "bg-slate-900 border-slate-800"}`}>
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-transparent text-[11px] font-mono outline-none cursor-pointer text-cyan-300 font-bold"
                title="Switch Role-Based Access Control (RBAC) Persona"
              >
                <option value="ADMIN" className="bg-slate-900 text-white">{language === "hi" ? "कमांडर (प्रशासक)" : "Commander (Admin)"}</option>
                <option value="DISASTER_MANAGER" className="bg-slate-900 text-white">{language === "hi" ? "आपदा प्रबंधक" : "Disaster Manager"}</option>
                <option value="FIELD_CREW" className="bg-slate-900 text-white">{language === "hi" ? "फील्ड स्काउट" : "Field Scout"}</option>
                <option value="CITIZEN_VIEWER" className="bg-slate-900 text-white">{language === "hi" ? "नागरिक / जनता" : "Citizen / Public"}</option>
              </select>
            </div>
          )}

          {/* Live Satellite status */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isOnline ? t.liveSatStatus : t.offlineMode}</span>
          </div>
        </div>

        {/* Right: Controls, SOS, Language, Mode Switcher */}
        <div className="flex items-center gap-2 justify-end w-full md:w-auto">
          {/* Theme Palette Switcher: Dark vs Pastel Light */}
          {setTheme && (
            <button
              onClick={() => setTheme(isLight ? "DARK" : "PASTEL_LIGHT")}
              className={`p-1.5 rounded-lg border flex items-center gap-1 text-xs font-mono font-semibold transition ${
                isLight
                  ? "bg-[#e5dcd0] border-[#cfc3b2] text-slate-800"
                  : "bg-slate-900 border-slate-800 text-amber-300 hover:text-white"
              }`}
              title="Toggle Theme (Dark Sci-Fi vs Pastel Light)"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">{language === "hi" ? (isLight ? "पेस्टेल" : "डार्क") : (isLight ? "Pastel" : "Dark")}</span>
            </button>
          )}

          {/* SIH Presentation Hub & OpenAPI Specs */}
          <button
            id="btn-presentation-hub"
            onClick={onOpenDocs}
            className={`flex items-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-md border transition shadow-xs font-mono ${
              isLight ? "bg-[#ece4d6] text-slate-800 border-[#ded5c6]" : "bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-slate-800"
            }`}
            title="SIH 2026 Presentation Hub, OpenAPI Swagger, and ERD"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{language === "hi" ? "SIH 062 हब" : "SIH 062 Hub"}</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* View Mode Toggle: Desktop Command Center vs Field Operator Mobile PWA */}
          <div className={`flex items-center p-0.5 rounded-lg border ${isLight ? "bg-[#ece4d6] border-[#ded5c6]" : "bg-slate-900 border-slate-800"}`}>
            <button
              id="view-toggle-desktop"
              onClick={() => setActiveView("digital-twin")}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition ${
                activeView !== "mobile-pwa"
                  ? "bg-slate-800 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Command Center Web Dashboard"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{language === "hi" ? "मुख्यालय कमान" : "HQ Command"}</span>
            </button>
            <button
              id="view-toggle-mobile"
              onClick={() => setActiveView("mobile-pwa")}
              className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition ${
                activeView === "mobile-pwa"
                  ? "bg-cyan-600 text-white shadow-xs font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Field Operator Offline Mobile PWA"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{language === "hi" ? "फील्ड PWA" : "Field PWA"}</span>
            </button>
          </div>

          {/* High Contrast */}
          <button
            id="btn-high-contrast"
            onClick={() => setHighContrast(!highContrast)}
            className={`p-1.5 rounded-md border transition ${
              isLight ? "bg-[#ece4d6] text-slate-700 border-[#ded5c6]" : "text-slate-300 hover:text-white border-slate-800 bg-slate-900 hover:bg-slate-800"
            }`}
            title={highContrast ? t.normalContrast : t.highContrast}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Multilingual Toggle */}
          <button
            id="btn-language-toggle"
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-md border transition font-mono ${
              isLight ? "bg-[#ece4d6] text-slate-800 border-[#ded5c6]" : "text-slate-300 bg-slate-900 hover:bg-slate-800 border-slate-800"
            }`}
            title={language === "en" ? "Click to switch interface to Hindi" : "अंग्रेज़ी में बदलने के लिए क्लिक करें"}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === "en" ? "English" : "हिन्दी"}</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-cyan-300 font-normal">
              {language === "en" ? "EN" : "HI"}
            </span>
          </button>

          {/* Emergency SOS Header Button */}
          <button
            id="btn-header-sos"
            onClick={onQuickSosClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition hover:shadow-md active:scale-95 font-mono"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{t.triggerSos}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
