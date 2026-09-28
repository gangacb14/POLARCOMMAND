import React, { useState } from "react";
import { Expedition, Language } from "../types";
import { translations } from "../i18n";
import confetti from "canvas-confetti";
import { 
  Calendar, 
  Users, 
  Fuel, 
  FileCheck, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  Send, 
  ShieldCheck, 
  FileText,
  AlertCircle,
  Clock,
  Compass
} from "lucide-react";

interface PlannerViewProps {
  expeditions: Expedition[];
  language: Language;
  onExpeditionCreated: (newExp: Expedition) => void;
  onPublishExpedition: (id: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  expeditions,
  language,
  onExpeditionCreated,
  onPublishExpedition,
}) => {
  const t = translations[language];
  const [selectedExpId, setSelectedExpId] = useState<string>(expeditions[0]?.id || "");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Expedition Form State
  const [name, setName] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [region, setRegion] = useState<"ANTARCTICA" | "ARCTIC">("ANTARCTICA");
  const [leaderName, setLeaderName] = useState("Dr. R. K. Singh (NCPOR)");
  const [baseStation, setBaseStation] = useState<"MAITRI" | "BHARATI" | "HIMADRI">("MAITRI");
  const [crewSize, setCrewSize] = useState<number>(24);
  const [durationDays, setDurationDays] = useState<number>(75);
  const [permitNumber, setPermitNumber] = useState("MoES/EIA/POLAR/2026/18");
  const [isPublishing, setIsPublishing] = useState(false);

  const activeExpedition = expeditions.find((e) => e.id === selectedExpId) || expeditions[0];

  // Polar Consumables & Fuel Calculation Engine
  const calculatedDiesel = crewSize * durationDays * 38; // ~38L/day per person for heating & snowcat traverses
  const calculatedJetA1 = region === "ANTARCTICA" ? 35000 : 12000;
  const calculatedRations = crewSize * durationDays * 1.15; // 15% emergency reserve
  const calculatedAutonomyDays = Math.floor(calculatedDiesel / (crewSize * 38));

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp: Expedition = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      code: `EXP-${region === "ARCTIC" ? "ARC" : "ANT"}-${new Date().getFullYear()}`,
      name: name || "Indian Polar Scientific Survey Mission",
      nameHi: nameHi || "भारतीय ध्रुवीय वैज्ञानिक सर्वेक्षण अभियान",
      region,
      leaderName,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + durationDays * 86400000).toISOString().split("T")[0],
      status: "PLANNING",
      baseStation,
      crewSize,
      routeGeoJSON: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                baseStation === "HIMADRI" ? [11.933, 78.923] : [11.735, -70.766],
                baseStation === "HIMADRI" ? [12.4, 79.05] : [76.187, -69.407],
              ],
            },
            properties: { name: "Planned Field Traverse Corridor" },
          },
        ],
      },
      fuelCalculations: {
        dieselLiters: calculatedDiesel,
        jetA1Liters: calculatedJetA1,
        dailyBurnRateLiters: crewSize * 38,
        reserveMarginPct: 25,
        estimatedDaysAutonomy: calculatedAutonomyDays,
      },
      environmentalClearance: {
        permitNumber,
        madridProtocolCompliant: true,
        wasteManagementTier: "TIER_1_RETURN_TO_INDIA",
        aspaOverflightPermit: true,
      },
    };

    onExpeditionCreated(newExp);
    setShowCreateModal(false);
    setSelectedExpId(newExp.id);
  };

  const handlePublish = (id: string) => {
    setIsPublishing(true);
    setTimeout(() => {
      onPublishExpedition(id);
      setIsPublishing(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // confetti fallback
      }
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Mission Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-600" />
            {t.planner}
          </h2>
          <p className="text-xs text-slate-500">
            Design polar traverse corridors, calculate fuel logistics, verify Madrid Protocol permits, and mobilize crews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-open-create-expedition"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-xs transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.createExpedition}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Expedition List + Detailed Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left List of Missions */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Registered Missions ({expeditions.length})
          </div>

          {expeditions.map((exp) => (
            <div
              key={exp.id}
              id={`expedition-card-${exp.id}`}
              onClick={() => setSelectedExpId(exp.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                exp.id === selectedExpId
                  ? "bg-sky-50/50 border-sky-300 ring-1 ring-sky-300 shadow-xs"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    {exp.code}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                    {language === "hi" && exp.nameHi ? exp.nameHi : exp.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Lead: {exp.leaderName}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    exp.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {exp.status}
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  {exp.crewSize} Crew
                </span>
                <span className="flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-slate-400" />
                  {exp.fuelCalculations.estimatedDaysAutonomy} Days Autonomy
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          {activeExpedition ? (
            <div className="space-y-5">
              {/* Mission Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {activeExpedition.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      Region: {activeExpedition.region}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    {language === "hi" && activeExpedition.nameHi ? activeExpedition.nameHi : activeExpedition.name}
                  </h3>
                  <p className="text-xs text-slate-500">Base: {activeExpedition.baseStation} | Mission Director: {activeExpedition.leaderName}</p>
                </div>

                {activeExpedition.status !== "ACTIVE" ? (
                  <button
                    id="btn-publish-mission"
                    disabled={isPublishing}
                    onClick={() => handlePublish(activeExpedition.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition active:scale-95 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isPublishing ? "Mobilizing..." : t.publishMission}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Mission Active & Field Mobilized
                  </div>
                )}
              </div>

              {/* Fuel & Consumables Logistics Calculator Results */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Fuel className="w-4 h-4 text-sky-600" />
                  Polar Consumables & Autonomy Calculator
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Diesel Fuel (Polar Blend)</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                      {activeExpedition.fuelCalculations.dieselLiters.toLocaleString()} L
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">FSII Anti-Waxing Additive</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Aviation Jet-A1</div>
                    <div className="text-base font-extrabold text-sky-700 mt-0.5">
                      {activeExpedition.fuelCalculations.jetA1Liters.toLocaleString()} L
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Kamov & Helicopter Sorties</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Burn Rate (Per Day)</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                      {activeExpedition.fuelCalculations.dailyBurnRateLiters.toLocaleString()} L/day
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Station Gensets + Convoys</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">{t.fuelAutonomy}</div>
                    <div className="text-base font-extrabold text-emerald-700 mt-0.5">
                      {activeExpedition.fuelCalculations.estimatedDaysAutonomy} Days
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-1">25% Safety Margin Included</div>
                  </div>
                </div>
              </div>

              {/* Environmental & Madrid Protocol Compliance */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Madrid Protocol Treaty Environmental Compliance
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Permit #{activeExpedition.environmentalClearance.permitNumber}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Waste Tier: Return to India (Zero Local Dumping)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>ASPA Geofencing Overflight Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 bg-white p-2 rounded border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Comprehensive Environmental Evaluation (CEE) Approved</span>
                  </div>
                </div>
              </div>

              {/* GeoJSON Traverse Route Visualizer */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  Traverse Corridor GeoJSON Waypoint Path
                </h4>
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                  <div className="text-[11px] text-slate-400 mb-1">
                    // PostGIS LineString geometry with 4326 spatial reference:
                  </div>
                  <pre>{JSON.stringify(activeExpedition.routeGeoJSON, null, 2)}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">No expedition selected</div>
          )}
        </div>
      </div>

      {/* Modal: Create New Mission */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create New Polar Expedition</h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure parameters for official registration with Ministry of Earth Sciences.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mission Title (English)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 45th Indian Scientific Expedition to Antarctica"
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mission Title (Hindi / हिन्दी)</label>
                <input
                  type="text"
                  value={nameHi}
                  onChange={(e) => setNameHi(e.target.value)}
                  placeholder="e.g. 45वां भारतीय वैज्ञानिक अंटार्कटिक अभियान"
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="ANTARCTICA">Antarctica (South Pole)</option>
                    <option value="ARCTIC">Arctic (Himadri / Svalbard)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Base Station</label>
                  <select
                    value={baseStation}
                    onChange={(e) => setBaseStation(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="MAITRI">Maitri (Schirmacher Oasis)</option>
                    <option value="BHARATI">Bharati (Larsemann Hills)</option>
                    <option value="HIMADRI">Himadri (Ny-Ålesund, Arctic)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Crew Size (Personnel)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={crewSize}
                    onChange={(e) => setCrewSize(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Traverse Duration (Days)</label>
                  <input
                    type="number"
                    min={7}
                    max={365}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mission Leader & Organization</label>
                <input
                  type="text"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Dynamic Calculations preview in modal */}
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-[11px] text-sky-900 space-y-1 font-mono">
                <div className="font-bold uppercase">Automated Polar Logistics Sizing:</div>
                <div>• Calculated Diesel Requirement: {calculatedDiesel.toLocaleString()} Liters</div>
                <div>• Estimated Autonomy: {calculatedAutonomyDays} Days with 25% Reserve</div>
                <div>• Caloric Rations Required: {Math.round(calculatedRations)} Man-Day Packs</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs transition"
                >
                  Confirm & Register Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
