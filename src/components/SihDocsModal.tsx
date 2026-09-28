import React, { useState } from "react";
import { 
  X, 
  BookOpen, 
  FileCode, 
  Database, 
  ShieldCheck, 
  Radio, 
  CloudSun, 
  Award, 
  ExternalLink,
  CheckCircle2,
  Copy
} from "lucide-react";

interface SihDocsModalProps {
  onClose: () => void;
}

export const SihDocsModal: React.FC<SihDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"SIH_DOSSIER" | "API_SPECS" | "ERD" | "MADRID_TREATY">("SIH_DOSSIER");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800 text-xs">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
              <Award className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  IPE-LAMS — SIH 2026 Executive Presentation Hub
                </h3>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded border border-sky-200">
                  MoES / NCPOR Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Integrated Polar Expedition Logistics & Asset Management Architecture Dossier
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-4">
          <button
            onClick={() => setActiveTab("SIH_DOSSIER")}
            className={`py-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "SIH_DOSSIER"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>SIH 2026 Solution Pitch</span>
          </button>

          <button
            onClick={() => setActiveTab("API_SPECS")}
            className={`py-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "API_SPECS"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>OpenAPI 3.1 & Iridium Protocol</span>
          </button>

          <button
            onClick={() => setActiveTab("ERD")}
            className={`py-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "ERD"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>PostgreSQL / PostGIS Schema</span>
          </button>

          <button
            onClick={() => setActiveTab("MADRID_TREATY")}
            className={`py-3 px-3 font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "MADRID_TREATY"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Madrid Protocol Compliance</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === "SIH_DOSSIER" && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                <h4 className="text-sm font-bold text-sky-950 mb-1">
                  Problem Statement: Ministry of Earth Sciences (MoES / NCPOR)
                </h4>
                <p className="text-xs text-sky-900 leading-relaxed">
                  Managing remote logistics, heavy machinery traverses, food rations cold chains, and personnel safety in Antarctica (-70°C, months of polar night, zero cellular connectivity) has historically suffered from fragmented spreadsheets, delayed satellite manifests, and blind communication spots.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-sky-600" />
                    1. Real-Time Telemetry & Iridium SBD
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    16-byte binary payload packed over Iridium satellite short burst data. Broadcast via SSE for sub-second command center updates.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    2. Offline-First Mobile PWA
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Stores check-ins, barcode scans, and emergency beacons locally in Service Worker / IndexedDB cache with prioritized auto-sync upon reconnection.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CloudSun className="w-4 h-4 text-amber-600" />
                    3. Live Authoritative Weather Feeds
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Ground-truth atmospheric data from IMD Antarctic Cell, Copernicus ECMWF ice analysis, and NOAA GFS for real blizzard alert triggers.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-600" />
                    4. Treaty Legal & Environmental Shield
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Enforces Antarctic Specially Protected Area (ASPA) geofences, zero local waste disposal tracking, and AES-256 encrypted medical records.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "API_SPECS" && (
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200">
                <span className="font-bold text-slate-700 font-sans">OpenAPI 3.1 REST & SSE Endpoints:</span>
                <span className="text-[10px] text-slate-400">Host: http://localhost:3000</span>
              </div>

              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] space-y-2 overflow-x-auto">
                <div><span className="text-emerald-400 font-bold">GET</span> /api/health → 200 OK health check</div>
                <div><span className="text-emerald-400 font-bold">GET</span> /api/expeditions → List polar expeditions</div>
                <div><span className="text-sky-400 font-bold">POST</span> /api/expeditions → Register new expedition with GeoJSON path</div>
                <div><span className="text-emerald-400 font-bold">GET</span> /api/assets → Fleet & condition telemetry list</div>
                <div><span className="text-sky-400 font-bold">POST</span> /api/telemetry/ingest → Binary Iridium SBD frame ingest</div>
                <div><span className="text-purple-400 font-bold">SSE</span> /api/telemetry/stream → Real-time Server-Sent Events stream</div>
                <div><span className="text-emerald-400 font-bold">GET</span> /api/weather/live?station=MAITRI → IMD/ECMWF Polar feed</div>
                <div><span className="text-sky-400 font-bold">POST</span> /api/offline/sync → Mobile store-and-forward batch sync</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs space-y-1">
                <div className="font-bold text-slate-900">16-Byte Packed Iridium Binary Format:</div>
                <div className="font-mono text-[11px] text-slate-600">
                  [0..1] Magic 0x4950 | [2..3] Asset ID | [4..7] Lat Int32 | [8..11] Lon Int32 | [12] Temp Int8 | [13] Batt Uint8 | [14] Shock Uint8 | [15] Status/Flags
                </div>
              </div>
            </div>
          )}

          {activeTab === "ERD" && (
            <div className="space-y-3 font-mono text-[11px]">
              <div className="text-xs font-bold text-slate-700 font-sans">
                PostgreSQL + PostGIS + TimescaleDB Hypertables:
              </div>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl overflow-x-auto space-y-2">
                <div className="text-sky-400">-- Core Relational Tables</div>
                <div>• stations (id, code, name, location GEOMETRY(Point, 4326), elevation_m)</div>
                <div>• expeditions (id, code, name, region, route_corridor GEOMETRY(LineString, 4326), permits_jsonb)</div>
                <div>• assets (id, code, category, current_location GEOMETRY(Point, 4326), chain_of_custody_jsonb)</div>
                <div>• asset_telemetry (time TIMESTAMPTZ NOT NULL, asset_id UUID, coordinates GEOMETRY(Point, 4326), temp_c, battery_pct, shock_g) -- TimescaleDB Hypertable</div>
                <div>• inventory_items (id, sku, batch_lot, category, quantity, min_threshold, cold_chain_c, expiry_date)</div>
                <div>• personnel (id, service_no, full_name, station_id, medical_clearance_aes256, last_checkin)</div>
                <div>• incidents (id, code, severity, type, coordinates GEOMETRY(Point, 4326), escalation_tier, status)</div>
              </div>
            </div>
          )}

          {activeTab === "MADRID_TREATY" && (
            <div className="space-y-3 font-sans text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 font-bold text-emerald-900">
                Protocol on Environmental Protection to the Antarctic Treaty (Madrid, 1991)
              </div>
              <div className="space-y-2">
                <div>
                  <strong>Annex I (Environmental Impact Assessment):</strong> Every expedition traverse requires an approved Comprehensive Environmental Evaluation (CEE) permit registered in IPE-LAMS.
                </div>
                <div>
                  <strong>Annex II (Conservation of Antarctic Fauna and Flora):</strong> Automated geofence boundary alerts surround Antarctic Specially Protected Areas (ASPA-136 at Schirmacher Oasis).
                </div>
                <div>
                  <strong>Annex III (Waste Disposal & Management):</strong> Zero local dumping policy. All solid and hazardous wastes are categorized under Tier 1 (Manifested for Return to India).
                </div>
                <div>
                  <strong>Annex IV (Marine Pollution):</strong> MV Vasiliy Golovnin ballast water discharge logging and sea ice route optimization.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-mono text-[11px]">
            Smart India Hackathon 2026 • Ministry of Earth Sciences
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
