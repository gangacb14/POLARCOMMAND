import React, { useState, useEffect } from "react";
import { CargoPassport, CargoPassportTimelineEvent } from "../types";
import { 
  X, 
  Boxes, 
  QrCode, 
  ShieldCheck, 
  Thermometer, 
  Activity, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  Radio, 
  AlertTriangle,
  Scan,
  Download,
  Copy,
  Check
} from "lucide-react";

interface CargoPassportModalProps {
  cargoId: string | null;
  onClose: () => void;
  onScanAnother?: (newId: string) => void;
}

export const CargoPassportModal: React.FC<CargoPassportModalProps> = ({
  cargoId,
  onClose,
  onScanAnother,
}) => {
  const [cargo, setCargo] = useState<CargoPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [scanSimulating, setScanSimulating] = useState(false);

  useEffect(() => {
    if (!cargoId) return;
    setLoading(true);
    fetch(`/api/cargo/passport/${cargoId}`)
      .then((res) => res.json())
      .then((data) => {
        setCargo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load cargo passport:", err);
        setLoading(false);
      });
  }, [cargoId]);

  if (!cargoId) return null;

  const handleSimulateScan = (idToScan: string) => {
    setScanSimulating(true);
    setTimeout(() => {
      setScanSimulating(false);
      if (onScanAnother) onScanAnother(idToScan);
    }, 600);
  };

  const handleCopyPayload = () => {
    if (!cargo) return;
    navigator.clipboard.writeText(cargo.qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const STEPS = ["CREATED", "PACKED", "LOADED", "DEPARTED", "IN_TRANSIT", "ARRIVED", "VERIFIED"] as const;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b1220] border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/90 border border-cyan-500/40 text-cyan-400">
              <Boxes className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  Digital Cargo Passport & Custody Ledger
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                  TAMPER-EVIDENT RFID
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Decentralized polar logistics identity: {cargo?.cargoId || cargoId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {loading ? (
            <div className="py-16 text-center text-slate-400 font-mono text-xs flex flex-col items-center gap-2">
              <Scan className="w-8 h-8 animate-spin text-cyan-400" />
              <span>Verifying Cryptographic Digital Passport Hash...</span>
            </div>
          ) : cargo ? (
            <>
              {/* Top Overview Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* QR Code & Identification */}
                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl flex flex-col items-center text-center justify-center">
                  <div className="p-3 bg-white rounded-lg shadow-md mb-2">
                    <QrCode className="w-16 h-16 text-slate-950" />
                  </div>
                  <span className="font-mono font-bold text-white text-xs">
                    {cargo.cargoId}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400/90 mt-0.5">
                    {cargo.rfidTag}
                  </span>
                  <button
                    onClick={handleCopyPayload}
                    className="mt-2 text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800 transition"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Payload Copied" : "Copy QR Payload"}</span>
                  </button>
                </div>

                {/* Passport Core Attributes */}
                <div className="sm:col-span-2 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Cargo Description:</span>
                    <span className="font-bold text-white text-right max-w-[240px] truncate">{cargo.name}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Weight & Category:</span>
                    <span className="text-cyan-400 font-bold">{cargo.weightKg} kg ({cargo.category})</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Destination:</span>
                    <span className="text-emerald-400 font-bold">{cargo.destination}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Current Carrier:</span>
                    <span className="text-slate-200">{cargo.currentLocation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Security Tamper Seal:</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>INTACT (UNCOMPROMISED)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Environmental Telemetry Sensors (Cold-chain Temp & Shock Log) */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                {/* Cold Chain Temp */}
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-cyan-400" /> Cold-Chain Ambient Temp
                    </span>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {cargo.temperatureC > 0 ? `+${cargo.temperatureC}` : cargo.temperatureC}°C
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    <div>Safe Min: {cargo.safeTempMinC}°C</div>
                    <div>Safe Max: {cargo.safeTempMaxC}°C</div>
                  </div>
                </div>

                {/* Impact Shock Log */}
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-amber-400" /> G-Force Shock Sensor
                    </span>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {cargo.shockG} G
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    <div>Limit: {cargo.shockLimitG} G</div>
                    <div className="text-emerald-400 font-bold">Nominal</div>
                  </div>
                </div>
              </div>

              {/* Custody Timeline: Created → Packed → Loaded → Departed → In Transit → Arrived → Verified */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                    Cryptographic Chain of Custody Timeline
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    7 Verified Milestones
                  </span>
                </div>

                {/* Horizontal / Stepper Timeline */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {STEPS.map((stepKey, idx) => {
                    const event = cargo.timeline.find((t) => t.step === stepKey);
                    const isPassed = event ? event.passed : false;
                    const isCurrent = cargo.status === stepKey;

                    return (
                      <div
                        key={stepKey}
                        className={`p-2.5 rounded-lg border flex flex-col justify-between text-xs transition ${
                          isPassed
                            ? "bg-slate-900/90 border-emerald-500/40"
                            : isCurrent
                            ? "bg-cyan-950/50 border-cyan-500/60 shadow-md"
                            : "bg-slate-950/50 border-slate-800/80 opacity-60"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[9px] font-bold text-slate-400">
                              0{idx + 1}
                            </span>
                            {isPassed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : isCurrent ? (
                              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            ) : (
                              <Clock className="w-3 h-3 text-slate-600" />
                            )}
                          </div>
                          <div className={`font-mono text-[11px] font-bold ${
                            isPassed ? "text-emerald-300" : isCurrent ? "text-cyan-300" : "text-slate-400"
                          }`}>
                            {stepKey.replace("_", " ")}
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 mt-2 line-clamp-1 font-sans">
                          {event?.location || "Pending"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Full Audit Event List */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Sign-Off Verification Log:
                  </div>
                  <div className="space-y-1.5">
                    {cargo.timeline.map((ev, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between text-xs p-2 rounded bg-slate-900/60 border border-slate-800/60 gap-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${ev.passed ? "bg-emerald-400" : "bg-slate-600"}`} />
                          <span className="font-bold text-slate-200">{ev.title}</span>
                          <span className="text-[10px] font-mono text-slate-400">({ev.location})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                          <span>Officer: {ev.verifiedBy}</span>
                          <span className="text-slate-600">|</span>
                          <span className="text-slate-500">{new Date(ev.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* QR Scanner Simulation Quick Switcher */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Scan className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-slate-300">
                    Simulate Live QR / RFID Scanner:
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {["POLAR-CN-104", "POLAR-MED-208", "POLAR-FUEL-902"].map((scanId) => (
                    <button
                      key={scanId}
                      onClick={() => handleSimulateScan(scanId)}
                      disabled={scanSimulating || cargo.cargoId === scanId}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition border ${
                        cargo.cargoId === scanId
                          ? "bg-cyan-950 text-cyan-300 border-cyan-500/50"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                      }`}
                    >
                      Scan {scanId}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-red-400 font-mono text-xs">
              Cargo Passport with ID {cargoId} not found in central NCPOR registry.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            Certified under Ministry of Earth Sciences Polar Supply Compliance ISO-28000
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};
