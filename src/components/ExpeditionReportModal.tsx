import React from "react";
import {
  X,
  FileText,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Boxes,
  Users,
  Ship,
  Sparkles,
  Award,
} from "lucide-react";

interface ExpeditionReportModalProps {
  onClose: () => void;
}

export const ExpeditionReportModal: React.FC<ExpeditionReportModalProps> = ({ onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#0b1220] border border-cyan-500/40 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-[#0d1829] to-cyan-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black font-mono tracking-tight text-white uppercase">
                  Expedition Mission Status Report
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                  AUTONOMOUS VERIFICATION PASS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                DOC-REF: POLAR-44-STATUS-2026 • Overall Dashboard Summary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-200 font-sans text-xs">
          {/* Mission Meta Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">MISSION NAME</span>
              <span className="text-white font-bold text-xs">44th Indian Antarctic Expedition</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ORGANIZATION</span>
              <span className="text-white font-bold text-xs">MoES / NCPOR Goa</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">DATE GENERATED</span>
              <span className="text-cyan-400 font-bold text-xs">19 Sept 2026 (Live Twin)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">MISSION HEALTH INDEX</span>
              <span className="text-emerald-400 font-bold text-xs">84 / 100 (STABLE)</span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>1. Executive Operational Assessment</span>
            </h3>
            <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              The 44th Expedition Digital Twin maintains active monitoring across 5 scientific research nodes (Maitri, Bharati, Himadri, DG Depot, and IndARC mooring). Continental autonomy across food and medical reserves remains above 90-day standards. What-If logistic simulation successfully mitigated a 5-day maritime ice-pack delay for <em>MV Vasiliy Golovnin</em> through proactive generator throttle and revised Route B sledge dispatch.
            </p>
          </div>

          {/* Section 2: Critical Lifeline Status Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Boxes className="w-4 h-4" />
              <span>2. Strategic Resource Depletion Horizons</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-950 text-slate-400 text-[11px]">
                  <tr>
                    <th className="p-2.5">Resource</th>
                    <th className="p-2.5">Current Stock</th>
                    <th className="p-2.5">Daily Burn</th>
                    <th className="p-2.5">Autonomy Runway</th>
                    <th className="p-2.5">Safety Reserve</th>
                    <th className="p-2.5">Action Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/40 text-[11px]">
                  <tr>
                    <td className="p-2.5 text-white font-bold">Polar Low-Freeze Diesel</td>
                    <td className="p-2.5">48,200 L (68%)</td>
                    <td className="p-2.5">420 L/day</td>
                    <td className="p-2.5 text-amber-400 font-bold">14.8 Days (Revised)</td>
                    <td className="p-2.5">5.0 Days</td>
                    <td className="p-2.5 text-emerald-400">Secured via Route B</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white font-bold">Freeze-Dried Rations</td>
                    <td className="p-2.5">2,330 kg (76%)</td>
                    <td className="p-2.5">95 kg/day</td>
                    <td className="p-2.5 text-emerald-400">24.5 Days</td>
                    <td className="p-2.5">14.0 Days</td>
                    <td className="p-2.5 text-emerald-400">Nominal</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white font-bold">Potable Meltwater</td>
                    <td className="p-2.5">10,500 L (82%)</td>
                    <td className="p-2.5">650 L/day</td>
                    <td className="p-2.5 text-emerald-400">16.2 Days</td>
                    <td className="p-2.5">7.0 Days</td>
                    <td className="p-2.5 text-emerald-400">Priyadarshini Active</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-white font-bold">Emergency Trauma Medkits</td>
                    <td className="p-2.5">84 Kits (62%)</td>
                    <td className="p-2.5">Periodic</td>
                    <td className="p-2.5 text-amber-400">11.8 Days</td>
                    <td className="p-2.5">15.0 Days</td>
                    <td className="p-2.5 text-cyan-400">Restock en route</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Emergency Resolution Record */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>3. Incident Response Log — Field Camp 03</span>
            </h3>
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white font-bold">Incident SOS-2026-08: Medical Trauma + Comm Loss</span>
                <span className="text-emerald-400 font-bold">RESOLVED BY AI DISPATCH</span>
              </div>
              <p className="text-slate-300 text-xs font-sans">
                Team Bravo deployed with Snowcat V-04 through ground-radar cleared Route B (18.4 km). All 6 affected glaciologists triaged and stabilized; portable Iridium satellite relay established at waypoint Alpha-Ridge.
              </p>
            </div>
          </div>

          {/* Commander AI Sign-off Block */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Verified by Polar Command Neural Copilot • Zero Unresolved Critical Risks</span>
            </div>
            <span className="text-emerald-400 font-bold">COMMAND APPROVED</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            NCPOR • Ministry of Earth Sciences, Govt. of India
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition shadow-md shadow-cyan-950"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
