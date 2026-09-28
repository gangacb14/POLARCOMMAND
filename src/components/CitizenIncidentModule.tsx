import React, { useState } from "react";
import {
  CitizenIncidentReport,
  BroadcastAlert,
  CitizenFeedbackEntry,
  UserRole,
  AppTheme,
} from "../types";
import {
  MOCK_CITIZEN_INCIDENTS,
  MOCK_BROADCAST_ALERTS,
  MOCK_CITIZEN_FEEDBACK,
} from "../data/enhancedDisasterData";
import {
  AlertTriangle,
  Send,
  MessageSquare,
  Smartphone,
  MapPin,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Radio,
  Share2,
  FileText,
  Star,
  Users,
  RefreshCw,
  Eye,
  Check,
  Globe,
  WifiOff,
} from "lucide-react";

interface CitizenIncidentModuleProps {
  userRole?: UserRole;
  theme?: AppTheme;
  isOnline?: boolean;
  onNewIncidentReported?: (report: CitizenIncidentReport) => void;
  onBroadcastDispatched?: (broadcast: BroadcastAlert) => void;
}

export const CitizenIncidentModule: React.FC<CitizenIncidentModuleProps> = ({
  userRole = "ADMIN",
  theme = "DARK",
  isOnline = true,
  onNewIncidentReported,
  onBroadcastDispatched,
}) => {
  const isLight = theme === "PASTEL_LIGHT";
  const [activeTab, setActiveTab] = useState<"REPORT" | "BROADCAST" | "FEEDBACK">("REPORT");

  // Incidents state
  const [incidents, setIncidents] = useState<CitizenIncidentReport[]>(MOCK_CITIZEN_INCIDENTS);
  const [broadcasts, setBroadcasts] = useState<BroadcastAlert[]>(MOCK_BROADCAST_ALERTS);
  const [feedbacks, setFeedbacks] = useState<CitizenFeedbackEntry[]>(MOCK_CITIZEN_FEEDBACK);

  // New Incident Form State
  const [reporterName, setReporterName] = useState("Field Scout Ramesh");
  const [reporterContact, setReporterContact] = useState("+91 98201 55432");
  const [reporterRole, setReporterRole] = useState<CitizenIncidentReport["reporterRole"]>("EXPEDITION_CREW");
  const [category, setCategory] = useState<CitizenIncidentReport["category"]>("FLOOD_MELT_INUNDATION");
  const [severity, setSeverity] = useState<CitizenIncidentReport["severity"]>("SEVERE");
  const [latitude, setLatitude] = useState<number>(-70.762);
  const [longitude, setLongitude] = useState<number>(11.758);
  const [locationName, setLocationName] = useState("Schirmacher Oasis West Lateral Moraine");
  const [notes, setNotes] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<string>("https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState("URGENT: Flash Meltwater & Crevasse Hazard Alert");
  const [broadcastTitleHi, setBroadcastTitleHi] = useState("तत्काल: तीव्र ग्लेशियर पिघलन एवं दरार चेतावनी");
  const [broadcastMessage, setBroadcastMessage] = useState("Flash melt surge observed along Corridor Alpha. All field parties proceed with caution to designated high-ground refuge huts.");
  const [broadcastMessageHi, setBroadcastMessageHi] = useState("कॉरिडोर अल्फा में अचानक पानी का तेज बहाव देखा गया है। सभी दल निकटतम उच्च आश्रय स्थल की ओर प्रस्थान करें।");
  const [broadcastSeverity, setBroadcastSeverity] = useState<BroadcastAlert["severity"]>("WARNING");
  const [selectedChannels, setSelectedChannels] = useState<Array<"SMS" | "WHATSAPP" | "CELL_BROADCAST" | "IRIDIUM_SATELLITE">>(["SMS", "WHATSAPP", "CELL_BROADCAST"]);
  const [targetSector, setTargetSector] = useState("All Sectors");
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Feedback Form State
  const [fbCitizenName, setFbCitizenName] = useState("");
  const [fbSector, setFbSector] = useState("Sector A (Maitri)");
  const [fbCategory, setFbCategory] = useState<CitizenFeedbackEntry["category"]>("WATER_RATIONS");
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState("");

  // Auto Geolocation Trigger
  const handleAutoGeolocate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(4)));
          setLongitude(Number(pos.coords.longitude.toFixed(4)));
          setLocationName(`GPS Verified [${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}]`);
        },
        () => {
          // Fallback polar coordinate
          setLatitude(-70.766);
          setLongitude(11.735);
          setLocationName("Maitri GPS Base Node");
        }
      );
    }
  };

  // Submit Incident Report Handler
  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const newReport: CitizenIncidentReport = {
        id: `REP-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        reporterName,
        reporterContact,
        reporterRole,
        category,
        severity,
        latitude,
        longitude,
        locationName,
        notes,
        photoUrl: selectedPhoto,
        photoExif: {
          cameraModel: "Rugged Leica Polar-Geotag v4",
          isoTimestamp: new Date().toISOString(),
          gpsAccuracyMeters: 1.8,
          altitudeM: Math.round(Math.random() * 80 + 30),
        },
        status: "PENDING_TRIAGE",
        offlineQueued: !isOnline,
      };

      setIncidents((prev) => [newReport, ...prev]);
      if (onNewIncidentReported) onNewIncidentReported(newReport);
      setIsSubmitting(false);
      setSubmitSuccessMsg(
        isOnline
          ? `✅ Incident ${newReport.id} logged and dispatched to Station Duty Officer!`
          : `📶 Incident ${newReport.id} queued locally (will sync automatically upon reconnect)!`
      );
      setNotes("");
      setTimeout(() => setSubmitSuccessMsg(null), 5000);
    }, 600);
  };

  // Dispatch Broadcast Handler
  const handleDispatchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);

    setTimeout(() => {
      const newAlert: BroadcastAlert = {
        id: `ALR-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        title: broadcastTitle,
        titleHi: broadcastTitleHi,
        message: broadcastMessage,
        messageHi: broadcastMessageHi,
        severity: broadcastSeverity,
        channels: selectedChannels,
        targetSectors: [targetSector],
        recipientCount: Math.floor(Math.random() * 50 + 130),
        deliverySuccessPct: 99.4,
        senderName: `${userRole === "ADMIN" ? "Mission Commander" : "Duty Officer"} via IPE-LAMS Gateway`,
      };

      setBroadcasts((prev) => [newAlert, ...prev]);
      if (onBroadcastDispatched) onBroadcastDispatched(newAlert);
      setIsDispatching(false);
      setDispatchSuccess(`📡 Multi-Channel Emergency Alert ${newAlert.id} successfully broadcasted to ${newAlert.recipientCount} recipients across SMS & WhatsApp!`);
      setTimeout(() => setDispatchSuccess(null), 6000);
    }, 800);
  };

  // Submit Citizen Feedback Handler
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbComment.trim()) return;

    const newFeedback: CitizenFeedbackEntry = {
      id: `FDB-${Date.now().toString().slice(-3)}`,
      timestamp: new Date().toISOString(),
      citizenName: fbCitizenName.trim() || "Anonymous Expedition Member",
      sector: fbSector,
      category: fbCategory,
      rating: fbRating,
      comment: fbComment,
      urgency: fbRating <= 2 ? "URGENT" : "NORMAL",
      status: "OPEN",
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);
    setFbComment("");
    setFbCitizenName("");
  };

  // Sample Photos to pick
  const SAMPLE_PHOTOS = [
    { label: "Glacial Melt Torrent", url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80" },
    { label: "Ice Shelf Fissure", url: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=600&q=80" },
    { label: "Blizzard Snow Drift", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80" },
  ];

  return (
    <div className="space-y-4">
      {/* Navigation Sub-Tabs Bar */}
      <div
        className={`p-3 rounded-2xl border backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-3 ${
          isLight
            ? "bg-[#faf8f5] border-[#e8e2d8] text-slate-800"
            : "bg-[#0b1326]/90 border-slate-800 text-slate-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("REPORT")}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              activeTab === "REPORT"
                ? "bg-red-600 text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>INCIDENT REPORTING (GPS + EXIF)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-900 text-white">
              {incidents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("BROADCAST")}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              activeTab === "BROADCAST"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>CITIZEN SMS / WHATSAPP ALERTS</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300">
              {broadcasts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("FEEDBACK")}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              activeTab === "FEEDBACK"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>COMMUNITY FEEDBACK & GRIEVANCES</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300">
              {feedbacks.length}
            </span>
          </button>
        </div>

        {!isOnline && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold animate-pulse">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Store-and-Forward Active</span>
          </div>
        )}
      </div>

      {/* TAB 1: INCIDENT REPORTING */}
      {activeTab === "REPORT" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Geotagged Reporting Form (6 cols) */}
          <div
            className={`lg:col-span-6 p-5 rounded-2xl border shadow-md space-y-4 ${
              isLight
                ? "bg-[#faf8f5] border-[#e8e2d8]"
                : "bg-[#0b1326]/90 border-slate-800"
            }`}
          >
            <div>
              <h3 className="text-base font-bold font-mono uppercase flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                <span>Geotagged Field Incident Submission</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Submit real-time hazard discoveries with automatic GPS coordinates, EXIF validation, and severity tagging.
              </p>
            </div>

            {submitSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-mono font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{submitSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitIncident} className="space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Reporter Name</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    required
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    required
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Hazard Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                    }`}
                  >
                    <option value="FLOOD_MELT_INUNDATION">Glacial Melt / Flood Inundation</option>
                    <option value="CREVASSE_FRACTURE">Crevasse / Ice Shelf Fissure</option>
                    <option value="LANDSLIDE_AVALANCHE">Snow Avalanche / Rockfall</option>
                    <option value="EQUIPMENT_FAIL">Machinery / Generator Freeze</option>
                    <option value="MEDICAL_SOS">Medical Trauma Emergency</option>
                    <option value="SUPPLY_CUTOFF">Rations / Water Exhaustion</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Severity Tier</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className={`w-full p-2 rounded-xl border outline-none ${
                      severity === "CRITICAL_SOS"
                        ? "bg-red-950 text-red-300 border-red-500 font-bold"
                        : isLight
                        ? "bg-white border-slate-300"
                        : "bg-slate-950 border-slate-700"
                    }`}
                  >
                    <option value="LOW">Low (Logistics Advisory)</option>
                    <option value="MODERATE">Moderate (Field Caution)</option>
                    <option value="SEVERE">Severe (Action Needed)</option>
                    <option value="CRITICAL_SOS">CRITICAL SOS (Immediate Evacuation)</option>
                  </select>
                </div>
              </div>

              {/* GPS Geotag Selector */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>GPS Geotag Verification</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoGeolocate}
                    className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold"
                  >
                    Auto-Acquire Coordinates
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500">Latitude:</span>
                    <input
                      type="number"
                      step="0.0001"
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Longitude:</span>
                    <input
                      type="number"
                      step="0.0001"
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Location Description:</span>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full p-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Photographic Evidence Attachment */}
              <div className="space-y-1.5">
                <label className="text-slate-400 block">Photographic / Sensor Evidence</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {SAMPLE_PHOTOS.map((sp) => (
                    <div
                      key={sp.label}
                      onClick={() => setSelectedPhoto(sp.url)}
                      className={`cursor-pointer rounded-lg border overflow-hidden shrink-0 transition ${
                        selectedPhoto === sp.url
                          ? "border-cyan-400 ring-2 ring-cyan-500/40"
                          : "border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={sp.url} alt={sp.label} className="w-16 h-12 object-cover" />
                      <div className="p-0.5 text-[9px] text-center truncate w-16 bg-slate-950 text-slate-300">
                        {sp.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-slate-400 block mb-1">Field Situation Observations & Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe meltwater depth, crevasse opening direction, personnel count affected..."
                  required
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "DISPATCHING GEOTAGGED INCIDENT..." : "TRANSMIT FIELD INCIDENT REPORT"}</span>
              </button>
            </form>
          </div>

          {/* Right: Verified Incident Feed & EXIF Inspector (6 cols) */}
          <div
            className={`lg:col-span-6 p-5 rounded-2xl border shadow-md space-y-4 ${
              isLight
                ? "bg-[#faf8f5] border-[#e8e2d8]"
                : "bg-[#0b1326]/90 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
              <h3 className="text-base font-bold font-mono uppercase flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-500" />
                <span>Verified Field Incidents Stream</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {incidents.length} Active Records
              </span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 space-y-2 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">
                        {inc.id}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          inc.severity === "CRITICAL_SOS"
                            ? "bg-red-950 text-red-300 border border-red-500"
                            : inc.severity === "SEVERE"
                            ? "bg-amber-950 text-amber-300 border border-amber-500"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(inc.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {inc.photoUrl && (
                      <img
                        src={inc.photoUrl}
                        alt="Incident"
                        className="w-20 h-16 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="text-xs font-mono text-cyan-300 font-semibold">
                        {inc.locationName}
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {inc.notes}
                      </p>
                    </div>
                  </div>

                  {/* EXIF Metadata Strip */}
                  {inc.photoExif && (
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
                      <span>Camera: {inc.photoExif.cameraModel}</span>
                      <span>GPS Accuracy: ±{inc.photoExif.gpsAccuracyMeters}m</span>
                      <span>Altitude: {inc.photoExif.altitudeM}m</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                    <span className="text-slate-400">Reporter: {inc.reporterName}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{inc.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CITIZEN SMS & WHATSAPP BROADCAST ALERTS */}
      {activeTab === "BROADCAST" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Alert Composer (6 cols) */}
          <div
            className={`lg:col-span-6 p-5 rounded-2xl border shadow-md space-y-4 ${
              isLight
                ? "bg-[#faf8f5] border-[#e8e2d8]"
                : "bg-[#0b1326]/90 border-slate-800"
            }`}
          >
            <div>
              <h3 className="text-base font-bold font-mono uppercase flex items-center gap-2 text-cyan-500">
                <Smartphone className="w-5 h-5" />
                <span>Multi-Channel Citizen Alert Dispatcher</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Broadcast emergency evacuation warnings and weather updates to citizens and field parties via SMS, WhatsApp, and Cell Broadcast.
              </p>
            </div>

            {dispatchSuccess && (
              <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 text-xs font-mono font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{dispatchSuccess}</span>
              </div>
            )}

            <form onSubmit={handleDispatchBroadcast} className="space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Target Sector / Ward</label>
                  <select
                    value={targetSector}
                    onChange={(e) => setTargetSector(e.target.value)}
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                    }`}
                  >
                    <option value="All Sectors">All Sectors (Mass Broadcast)</option>
                    <option value="Sector A (Maitri)">Sector A (Maitri & Schirmacher)</option>
                    <option value="Sector B (Bharati)">Sector B (Bharati & Larsemann)</option>
                    <option value="Sector C (Himadri)">Sector C (Himadri & Ny-Ålesund)</option>
                    <option value="Sector D (Traverse Ice)">Sector D (Traverse Corridors)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Alert Severity</label>
                  <select
                    value={broadcastSeverity}
                    onChange={(e) => setBroadcastSeverity(e.target.value as any)}
                    className={`w-full p-2 rounded-xl border outline-none ${
                      broadcastSeverity === "EMERGENCY_EVACUATE"
                        ? "bg-red-950 text-red-300 border-red-500 font-bold"
                        : isLight
                        ? "bg-white border-slate-300"
                        : "bg-slate-950 border-slate-700"
                    }`}
                  >
                    <option value="ADVISORY">Advisory (General Information)</option>
                    <option value="WARNING">Warning (Preparatory Action)</option>
                    <option value="EMERGENCY_EVACUATE">EMERGENCY EVACUATION (Red Level)</option>
                  </select>
                </div>
              </div>

              {/* Delivery Channels */}
              <div>
                <label className="text-slate-400 block mb-1.5">Active Transmission Channels</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["SMS", "WHATSAPP", "CELL_BROADCAST", "IRIDIUM_SATELLITE"] as const).map((ch) => {
                    const isChecked = selectedChannels.includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedChannels(selectedChannels.filter((c) => c !== ch));
                          } else {
                            setSelectedChannels([...selectedChannels, ch]);
                          }
                        }}
                        className={`p-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                          isChecked
                            ? "bg-cyan-600 text-white border-cyan-400"
                            : "bg-slate-950/60 border-slate-800 text-slate-400"
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${isChecked ? "opacity-100" : "opacity-0"}`} />
                        <span>{ch.replace("_", " ")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* English & Hindi Title */}
              <div className="space-y-2">
                <div>
                  <label className="text-slate-400 block mb-1">Alert Headline (English)</label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    required
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">चेतावनी शीर्षक (Hindi - हिन्दी)</label>
                  <input
                    type="text"
                    value={broadcastTitleHi}
                    onChange={(e) => setBroadcastTitleHi(e.target.value)}
                    required
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                    }`}
                  />
                </div>
              </div>

              {/* Message Bodies */}
              <div className="space-y-2">
                <div>
                  <label className="text-slate-400 block mb-1">Full SMS / WhatsApp Broadcast Message (English)</label>
                  <textarea
                    rows={2}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    required
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">संदेश विवरण (Hindi - हिन्दी)</label>
                  <textarea
                    rows={2}
                    value={broadcastMessageHi}
                    onChange={(e) => setBroadcastMessageHi(e.target.value)}
                    required
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isDispatching}
                className="w-full py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition"
              >
                <Send className="w-4 h-4" />
                <span>{isDispatching ? "BROADCASTING TO TELECOM GATEWAYS..." : "DISPATCH EMERGENCY BROADCAST NOW"}</span>
              </button>
            </form>
          </div>

          {/* Right: Broadcast History & Phone Preview (6 cols) */}
          <div
            className={`lg:col-span-6 p-5 rounded-2xl border shadow-md space-y-4 ${
              isLight
                ? "bg-[#faf8f5] border-[#e8e2d8]"
                : "bg-[#0b1326]/90 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
              <h3 className="text-base font-bold font-mono uppercase flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-500" />
                <span>Dispatched Citizen Broadcast Logs</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Avg Delivery: 99.1%
              </span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {broadcasts.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{b.id}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          b.severity === "EMERGENCY_EVACUATE"
                            ? "bg-red-950 text-red-300 border border-red-500"
                            : "bg-amber-950 text-amber-300 border border-amber-500"
                        }`}
                      >
                        {b.severity}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(b.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-cyan-300 font-mono">{b.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{b.message}</p>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
                    <div className="text-[10px] text-amber-400 font-bold mb-0.5">हिन्दी संदेश:</div>
                    {b.messageHi}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-1.5">
                      {b.channels.map((ch) => (
                        <span key={ch} className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                          {ch}
                        </span>
                      ))}
                    </div>
                    <span className="text-emerald-400 font-bold">
                      {b.recipientCount} Recipients ({b.deliverySuccessPct}% Delivered)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMMUNITY FEEDBACK & GRIEVANCES */}
      {activeTab === "FEEDBACK" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Feedback Submit Form (5 cols) */}
          <div
            className={`lg:col-span-5 p-5 rounded-2xl border shadow-md space-y-4 ${
              isLight
                ? "bg-[#faf8f5] border-[#e8e2d8]"
                : "bg-[#0b1326]/90 border-slate-800"
            }`}
          >
            <div>
              <h3 className="text-base font-bold font-mono uppercase flex items-center gap-2 text-emerald-500">
                <MessageSquare className="w-5 h-5" />
                <span>Submit Citizen Situation Feedback</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Share localized camp feedback, shelter heating quality, or emergency supplies needed.
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Your Name / Call Sign</label>
                <input
                  type="text"
                  value={fbCitizenName}
                  onChange={(e) => setFbCitizenName(e.target.value)}
                  placeholder="e.g. Dr. Sunita / Field Camp 02"
                  className={`w-full p-2 rounded-xl border outline-none ${
                    isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Sector</label>
                  <select
                    value={fbSector}
                    onChange={(e) => setFbSector(e.target.value)}
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                    }`}
                  >
                    <option value="Sector A (Maitri)">Sector A (Maitri)</option>
                    <option value="Sector B (Bharati)">Sector B (Bharati)</option>
                    <option value="Sector C (Himadri)">Sector C (Himadri)</option>
                    <option value="Sector D (Traverse)">Sector D (Traverse)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Feedback Category</label>
                  <select
                    value={fbCategory}
                    onChange={(e) => setFbCategory(e.target.value as any)}
                    className={`w-full p-2 rounded-xl border outline-none ${
                      isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                    }`}
                  >
                    <option value="WATER_RATIONS">Water & Rations</option>
                    <option value="SHELTER_HYGIENE">Shelter Heating / Beds</option>
                    <option value="MEDICAL_NEED">Medical Assistance</option>
                    <option value="ROAD_STATUS">Traverse Track Drift</option>
                    <option value="GENERAL">General Situation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Rating / Satisfaction (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFbRating(star)}
                      className={`p-1.5 rounded-lg transition ${
                        fbRating >= star ? "text-amber-400 bg-amber-950/60" : "text-slate-600 hover:text-slate-400"
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    {fbRating <= 2 ? "Critical Issue" : fbRating === 3 ? "Moderate" : "Good"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Feedback & Description</label>
                <textarea
                  rows={3}
                  value={fbComment}
                  onChange={(e) => setFbComment(e.target.value)}
                  placeholder="Detail your request or situation update..."
                  required
                  className={`w-full p-2 rounded-xl border outline-none ${
                    isLight ? "bg-white border-slate-300" : "bg-slate-950 border-slate-700"
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition"
              >
                <Send className="w-4 h-4" />
                <span>SUBMIT FEEDBACK & LOG</span>
              </button>
            </form>
          </div>

          {/* Right: Feedback Grievance Log (7 cols) */}
          <div
            className={`lg:col-span-7 p-5 rounded-2xl border shadow-md space-y-4 ${
              isLight
                ? "bg-[#faf8f5] border-[#e8e2d8]"
                : "bg-[#0b1326]/90 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
              <h3 className="text-base font-bold font-mono uppercase flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-500" />
                <span>Community Situation & Grievance Board</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {feedbacks.length} Feedback Logs
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {feedbacks.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{f.citizenName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                        {f.sector}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: f.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-200">{f.comment}</p>

                  {f.resolutionNotes && (
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolution: {f.resolutionNotes}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                    <span>{new Date(f.timestamp).toLocaleTimeString()}</span>
                    <span className={f.status === "ADDRESSED" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                      Status: {f.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
