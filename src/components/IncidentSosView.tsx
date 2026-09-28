import React, { useState } from "react";
import { Incident, Language } from "../types";
import { translations } from "../i18n";
import { 
  AlertOctagon, 
  Radio, 
  PhoneCall, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ShieldAlert, 
  Compass, 
  AlertTriangle,
  Send
} from "lucide-react";

interface IncidentSosViewProps {
  incidents: Incident[];
  language: Language;
  onTriggerSos: (data: Partial<Incident>) => void;
  onResolveIncident: (id: string) => void;
}

export const IncidentSosView: React.FC<IncidentSosViewProps> = ({
  incidents,
  language,
  onTriggerSos,
  onResolveIncident,
}) => {
  const t = translations[language];
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || "");
  const [showTriggerModal, setShowTriggerModal] = useState(false);

  // New SOS Trigger Form
  const [sosType, setSosType] = useState<Incident["type"]>("CREVASSE_FALL");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("-70.84");
  const [longitude, setLongitude] = useState("12.05");

  const activeIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const handleSosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerSos({
      type: sosType,
      severity: "SOS_CRITICAL",
      description: description || "Polar Distress Beacon Activated from Field Unit",
      location: {
        latitude: Number(latitude) || -70.84,
        longitude: Number(longitude) || 12.05,
        description: "Field coordinates flagged on polar grid",
      },
    });
    setShowTriggerModal(false);
    setDescription("");
  };

  return (
    <div className="space-y-4">
      {/* Top Warning Banner */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-xs animate-bounce">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-red-950 flex items-center gap-2">
              {t.incidents}
            </h2>
            <p className="text-xs text-red-800">
              Multi-tier automated escalation chain across Maitri/Bharati Base, NCPOR Goa Ops Room, and MoES SAR Command.
            </p>
          </div>
        </div>

        <button
          id="btn-open-sos-modal"
          onClick={() => setShowTriggerModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition active:scale-95"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Activate SOS Beacon</span>
        </button>
      </div>

      {/* Grid: Incident Feed & Escalation Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Incident List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Logged Incidents ({incidents.length})
          </div>

          {incidents.map((incident) => (
            <div
              key={incident.id}
              id={`incident-item-${incident.id}`}
              onClick={() => setSelectedIncidentId(incident.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                incident.id === selectedIncidentId
                  ? "bg-red-50/50 border-red-300 ring-1 ring-red-300 shadow-xs"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-700">{incident.code}</span>
                    <span className="text-[10px] font-semibold bg-red-100 text-red-800 px-1.5 py-0.2 rounded">
                      {incident.severity}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {incident.type.replace("_", " ")}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{incident.description}</p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    incident.status === "RESOLVED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800 animate-pulse"
                  }`}
                >
                  {incident.status}
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(incident.triggeredAt).toLocaleTimeString()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {incident.location.latitude.toFixed(2)}°, {incident.location.longitude.toFixed(2)}°
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Incident Escalation Chain */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          {activeIncident ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {activeIncident.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {activeIncident.expeditionId}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {activeIncident.type.replace("_", " ")}
                  </h3>
                  <p className="text-xs text-slate-500">{activeIncident.location.description}</p>
                </div>

                {activeIncident.status !== "RESOLVED" ? (
                  <button
                    onClick={() => onResolveIncident(activeIncident.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Resolved
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <strong>Incident Narrative:</strong> {activeIncident.description}
              </div>

              {/* Automated Escalation Chain Tree */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-sky-600" />
                  Automated Multi-Tier Crisis Escalation Tree
                </h4>

                <div className="space-y-2.5">
                  {/* Tier 1 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3 text-xs">
                    <div className="p-2 bg-sky-100 text-sky-800 rounded-lg shrink-0 mt-0.5">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Tier 1: Station Base Operations</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          DISPATCHED
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Maitri Comms / Bharati Station Master VHF Emergency Channel 16 Broadcast.
                      </p>
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3 text-xs">
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Tier 2: NCPOR Goa 24/7 War Room</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          DISPATCHED
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Satellite Iridium SBD priority packet routed directly to Duty Director & Flight Coordinator.
                      </p>
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3 text-xs">
                    <div className="p-2 bg-red-100 text-red-800 rounded-lg shrink-0 mt-0.5">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Tier 3: MoES New Delhi / Indian Navy SAR</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          ACTIVE STANDBY
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Disaster Cell, Prithvi Bhavan, New Delhi. SAR Kamov / Twin Otter airlift standby.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">No incidents currently logged</div>
          )}
        </div>
      </div>

      {/* Modal: Activate SOS Beacon */}
      {showTriggerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 text-xs">
            <div className="flex items-center gap-2 text-red-700 mb-1 font-bold text-base">
              <AlertOctagon className="w-5 h-5" />
              Emergency SOS Beacon Activation
            </div>
            <p className="text-slate-500 mb-4">
              Transmits priority distress telemetry across all polar satellite bands.
            </p>

            <form onSubmit={handleSosSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Distress Emergency Type</label>
                <select
                  value={sosType}
                  onChange={(e) => setSosType(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="CREVASSE_FALL">Crevasse Fall / Sledge Anchored</option>
                  <option value="BLIZZARD_STRANDED">Blizzard Whiteout / Zero Visibility</option>
                  <option value="EQUIPMENT_FAILURE">Vehicle Track Snapped / Engine Freeze</option>
                  <option value="MEDICAL_EMERGENCY">Severe Hypothermia / Medical Trauma</option>
                  <option value="FUEL_LEAK">Polar Fuel Spill / Loss of Heating</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Latitude (°S)</label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Longitude (°E)</label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Situation Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe emergency conditions, injuries, and weather..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowTriggerModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg shadow-sm transition"
                >
                  Broadcast SOS Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
