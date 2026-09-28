import React, { useState, useEffect, useCallback } from "react";
import { OfflineSyncQueueItem, Language, Asset } from "../types";
import { translations } from "../i18n";
import { 
  Smartphone, 
  AlertOctagon, 
  QrCode, 
  MapPin, 
  RefreshCw, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  Battery, 
  ShieldCheck, 
  Camera, 
  Clock, 
  Send,
  Radio,
  Server,
  Database,
  Check,
  AlertCircle
} from "lucide-react";

interface MobileFieldPWAViewProps {
  language: Language;
  currentStation: string;
  assets: Asset[];
  onTriggerSos: (payload: any) => void;
  onCargoScanned: (cargoId: string, location: string) => void;
}

export const MobileFieldPWAView: React.FC<MobileFieldPWAViewProps> = ({
  language,
  currentStation,
  assets,
  onTriggerSos,
  onCargoScanned,
}) => {
  const t = translations[language];
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<OfflineSyncQueueItem[]>(() => {
    const saved = localStorage.getItem("ipe_offline_queue");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: "ACT-QUEUE-01",
        actionType: "PERSONNEL_CHECKIN",
        timestamp: new Date().toISOString(),
        payload: {
          personnelId: "PERS-POLAR-01",
          station: "Maitri Intermediate Waypoint Charlie",
          status: "FIELD_TRAVERSE",
        },
        priority: 2,
        synced: false,
      },
    ];
  });

  // Last synchronized timestamp with Mission Control server
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(() => {
    const saved = localStorage.getItem("ipe_last_synced_at");
    if (saved) return saved;
    // Initial default: 2 minutes ago
    const initialTime = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    localStorage.setItem("ipe_last_synced_at", initialTime);
    return initialTime;
  });

  const [timeAgo, setTimeAgo] = useState<string>("just now");
  const [syncFeedbackMessage, setSyncFeedbackMessage] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"SOS" | "SCAN" | "CHECKIN" | "QUEUE">("SOS");
  const [scannedCode, setScannedCode] = useState("");
  const [scanResultNotice, setScanResultNotice] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [checkInLocation, setCheckInLocation] = useState("Intermediate Convoy Shelter");
  const [checkInNotice, setCheckInNotice] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [sosSentNotice, setSosSentNotice] = useState(false);

  // Calculate human-readable relative time
  const calculateTimeAgo = useCallback((isoString: string) => {
    if (!isoString) return "never";
    const diffMs = Date.now() - new Date(isoString).getTime();
    if (diffMs < 0) return "just now";
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 15) return "just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${Math.floor(diffHour / 24)}d ago`;
  }, []);

  // Update relative time display periodically
  useEffect(() => {
    setTimeAgo(calculateTimeAgo(lastSyncedAt));
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo(lastSyncedAt));
    }, 5000);
    return () => clearInterval(interval);
  }, [lastSyncedAt, calculateTimeAgo]);

  useEffect(() => {
    localStorage.setItem("ipe_offline_queue", JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  const queueAction = (actionType: OfflineSyncQueueItem["actionType"], payload: any, priority: number) => {
    const item: OfflineSyncQueueItem = {
      id: `QUEUE-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      actionType,
      timestamp: new Date().toISOString(),
      payload,
      priority,
      synced: false,
    };

    setOfflineQueue((prev) => [item, ...prev]);

    // If online, immediately push to server sync endpoint
    if (!isSimulatedOffline) {
      syncSingleItem(item);
    }
  };

  const syncSingleItem = async (item: OfflineSyncQueueItem) => {
    try {
      const res = await fetch("/api/offline/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actions: [item] }),
      });
      if (res.ok) {
        const data = await res.json();
        const syncTimestamp = data.syncedAt || new Date().toISOString();
        setLastSyncedAt(syncTimestamp);
        localStorage.setItem("ipe_last_synced_at", syncTimestamp);
        setOfflineQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, synced: true } : q)));
      }
    } catch (err) {
      // Remain queued in offline store
    }
  };

  const handleSyncAll = async () => {
    if (isSimulatedOffline) return;
    setIsSyncing(true);
    setSyncFeedbackMessage("");
    try {
      const unsynced = offlineQueue.filter((q) => !q.synced);
      const res = await fetch("/api/offline/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actions: unsynced.length > 0 ? unsynced : offlineQueue }),
      });
      const data = await res.json();
      const syncTimestamp = data.syncedAt || new Date().toISOString();
      setLastSyncedAt(syncTimestamp);
      localStorage.setItem("ipe_last_synced_at", syncTimestamp);
      setOfflineQueue((prev) => prev.map((q) => ({ ...q, synced: true })));
      setSyncFeedbackMessage("Synchronized with Mission Control");
      setTimeout(() => setSyncFeedbackMessage(""), 3500);
    } catch (e) {
      setSyncFeedbackMessage("Offline: Queued in local cache");
      setTimeout(() => setSyncFeedbackMessage(""), 3500);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFieldSos = () => {
    const payload = {
      type: "FIELD_ONE_TAP_BEACON",
      severity: "SOS_CRITICAL",
      description: "FIELD OPERATOR EMERGENCY TRIGGERED VIA PWA",
      location: {
        latitude: currentStation === "HIMADRI" ? 78.92 : -70.76,
        longitude: currentStation === "HIMADRI" ? 11.93 : 11.73,
        description: `${currentStation} Field Sector`,
      },
    };

    queueAction("SOS_BEACON", payload, 1);
    onTriggerSos(payload);
    setSosSentNotice(true);
    setTimeout(() => setSosSentNotice(false), 4000);
  };

  const handleSimulateScan = (code: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedCode(code);
      setScanResultNotice(`Verified Asset: ${code} logged in custody.`);
      queueAction(
        "CARGO_SCAN",
        {
          code,
          location: checkInLocation,
          operator: "Field Operator (PWA)",
        },
        3
      );
      onCargoScanned(code, checkInLocation);
      setTimeout(() => setScanResultNotice(""), 3500);
    }, 800);
  };

  const handleFieldCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    queueAction(
      "PERSONNEL_CHECKIN",
      {
        location: checkInLocation,
        timestamp: new Date().toISOString(),
        station: currentStation,
      },
      2
    );
    setCheckInNotice(`Location "${checkInLocation}" logged successfully.`);
    setTimeout(() => setCheckInNotice(""), 3000);
  };

  const unsyncedCount = offlineQueue.filter((q) => !q.synced).length;
  const formattedSyncTime = new Date(lastSyncedAt).toUTCString().slice(17, 25);
  const formattedSyncDate = new Date(lastSyncedAt).toLocaleDateString([], { month: "short", day: "numeric" });

  return (
    <div className="max-w-md mx-auto py-2">
      {/* Mobile Device Mockup Frame */}
      <div className="bg-slate-900 rounded-3xl p-3 shadow-2xl border-4 border-slate-700 text-white">
        {/* Mobile Device Status Bar */}
        <div className="flex items-center justify-between px-3 py-1 text-[11px] font-mono text-slate-400 border-b border-slate-800">
          <span>{new Date().toUTCString().slice(17, 22)} UTC</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                isSimulatedOffline
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
              }`}
            >
              {isSimulatedOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
              <span>{isSimulatedOffline ? "Offline" : "Sat Link"}</span>
            </button>
            <span className="flex items-center gap-0.5">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              94%
            </span>
          </div>
        </div>

        {/* Sync Status Indicator Banner */}
        <div className="mt-2 px-3 py-2 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex h-2.5 w-2.5 shrink-0">
              {isSimulatedOffline ? (
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              ) : isSyncing ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
                </>
              ) : (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-200 tracking-wide uppercase">
                  Sync Status:
                </span>
                <span
                  className={`text-[10px] font-semibold font-mono ${
                    isSimulatedOffline
                      ? "text-amber-400"
                      : isSyncing
                      ? "text-sky-400"
                      : "text-emerald-400"
                  }`}
                >
                  {isSimulatedOffline
                    ? "Offline Cache Active"
                    : isSyncing
                    ? "Syncing to MC..."
                    : unsyncedCount > 0
                    ? `${unsyncedCount} Queued`
                    : "Synchronized"}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                <span className="truncate">
                  Last: <strong className="text-slate-300 font-normal">{formattedSyncTime} UTC</strong> ({timeAgo})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Force Sync Action Button */}
          <button
            onClick={handleSyncAll}
            disabled={isSyncing || isSimulatedOffline}
            title={isSimulatedOffline ? "Offline Mode Enabled" : "Synchronize cache with Mission Control Server"}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 shrink-0 transition ${
              isSimulatedOffline
                ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                : "bg-sky-500/15 hover:bg-sky-500/25 active:scale-95 text-sky-300 border border-sky-500/30 shadow-sm"
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-sky-400" : ""}`} />
            <span>{isSyncing ? "Syncing" : "Sync Now"}</span>
          </button>
        </div>

        {syncFeedbackMessage && (
          <div className="mt-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-[10px] font-mono text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              {syncFeedbackMessage}
            </span>
            <span className="text-emerald-400/80">{formattedSyncTime} UTC</span>
          </div>
        )}

        {/* Header inside Phone */}
        <div className="p-3 bg-slate-800/80 rounded-2xl mt-2 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
              {currentStation} SECTOR PWA
            </div>
            <h3 className="text-sm font-bold text-white">Field Operator Station</h3>
          </div>

          <button
            onClick={() => setActiveTab("QUEUE")}
            className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded-lg text-xs font-mono font-semibold text-slate-200 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-sky-400" : ""}`} />
            <span>{unsyncedCount} Queued</span>
          </button>
        </div>

        {/* Tab Navigation with 48px Touch Targets for Sub-Zero Gloves */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl my-3 text-xs">
          <button
            onClick={() => setActiveTab("SOS")}
            className={`py-3 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition ${
              activeTab === "SOS" ? "bg-red-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span className="text-[11px]">SOS</span>
          </button>

          <button
            onClick={() => setActiveTab("SCAN")}
            className={`py-3 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition ${
              activeTab === "SCAN" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span className="text-[11px]">Scan</span>
          </button>

          <button
            onClick={() => setActiveTab("CHECKIN")}
            className={`py-3 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition ${
              activeTab === "CHECKIN" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-[11px]">Check-In</span>
          </button>

          <button
            onClick={() => setActiveTab("QUEUE")}
            className={`py-3 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition ${
              activeTab === "QUEUE" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-[11px]">Sync ({unsyncedCount})</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="bg-slate-950 p-4 rounded-2xl min-h-[380px] flex flex-col justify-between border border-slate-800">
          {activeTab === "SOS" && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 my-auto">
              <div className="text-xs text-slate-400">
                Large Touch Target for Heavy Polar Gloves. Transmits emergency beacon with GPS coordinates.
              </div>

              {/* Giant SOS Button */}
              <button
                id="btn-pwa-giant-sos"
                onClick={handleFieldSos}
                className="w-44 h-44 rounded-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white flex flex-col items-center justify-center shadow-lg shadow-red-900/50 border-4 border-red-400 active:scale-90 transition transform"
              >
                <AlertOctagon className="w-16 h-16 animate-pulse" />
                <span className="text-2xl font-black tracking-wider mt-1">SOS</span>
                <span className="text-[10px] tracking-tight uppercase opacity-90">One-Tap Trigger</span>
              </button>

              {sosSentNotice && (
                <div className="p-2.5 bg-red-950 border border-red-500 rounded-lg text-xs font-bold text-red-200 animate-pulse">
                  🚨 SOS DISTRESS BEACON QUEUED & BROADCAST TO ALL CHANNELS
                </div>
              )}

              <div className="text-[11px] text-slate-500">
                Auto-routes to Maitri Comms & MoES New Delhi via Iridium SBD.
              </div>
            </div>
          )}

          {activeTab === "SCAN" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Scan QR or Barcode on sledges, fuel barrels, or rations boxes.
              </div>

              {/* Simulated Camera Viewfinder */}
              <div className="relative h-48 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center">
                {isScanning ? (
                  <div className="text-sky-400 font-mono text-xs flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span>Decoding Optical Polar Tag...</span>
                  </div>
                ) : (
                  <>
                    <Camera className="w-10 h-10 text-slate-700" />
                    <div className="absolute inset-x-8 inset-y-6 border-2 border-dashed border-sky-400/60 rounded-lg pointer-events-none animate-pulse"></div>
                    <span className="text-[11px] text-slate-500 mt-2 font-mono">Align QR/Barcode inside frame</span>
                  </>
                )}
              </div>

              {/* Scan Results Notice */}
              {scanResultNotice && (
                <div className="p-2.5 bg-emerald-950 border border-emerald-500 rounded-lg text-xs font-bold text-emerald-300">
                  ✅ {scanResultNotice}
                </div>
              )}

              {/* Quick Scan Test Buttons for Field Assets */}
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                  Tap to Simulate Scan Tag:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {assets.slice(0, 4).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => handleSimulateScan(a.code)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-left text-slate-300 font-mono text-[11px] truncate"
                    >
                      {a.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "CHECKIN" && (
            <form onSubmit={handleFieldCheckIn} className="space-y-4 my-auto">
              <div className="text-xs text-slate-400">
                Submit periodic waypoint check-in. Cached offline in IndexedDB and forwarded upon satellite link.
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Current Sector / Shelter</label>
                  <input
                    type="text"
                    required
                    value={checkInLocation}
                    onChange={(e) => setCheckInLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
                  <div className="text-sky-400 font-bold">GPS Coordinates:</div>
                  <div>Lat: {currentStation === "HIMADRI" ? "78.9234° N" : "-70.7661° S"}</div>
                  <div>Lon: {currentStation === "HIMADRI" ? "11.9332° E" : "11.7350° E"}</div>
                  <div>Accuracy: ± 3.2 meters</div>
                </div>

                {checkInNotice && (
                  <div className="p-2.5 bg-emerald-950 border border-emerald-500 rounded-lg text-xs font-bold text-emerald-300">
                    ✅ {checkInNotice}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm transition active:scale-95"
                >
                  Submit Waypoint Check-In
                </button>
              </div>
            </form>
          )}

          {activeTab === "QUEUE" && (
            <div className="space-y-3 flex flex-col justify-between h-full">
              <div className="space-y-2.5">
                {/* Detailed Cache & Sync Telemetry Card */}
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-sky-400" />
                      Offline-First Cache Status
                    </span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isSimulatedOffline
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      }`}
                    >
                      {isSimulatedOffline ? "LOCAL CACHE ONLY" : "SAT LINK ACTIVE"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block">LAST SERVER SYNC</span>
                      <span className="text-slate-200 font-bold block">{formattedSyncTime} UTC</span>
                      <span className="text-[9px] text-sky-400">({timeAgo})</span>
                    </div>

                    <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block">TARGET SERVER</span>
                      <span className="text-slate-200 font-bold block truncate">MoES / NCPOR</span>
                      <span className="text-[9px] text-emerald-400">Central Command</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
                  <span className="font-bold text-slate-300">Offline Store Queue</span>
                  <span className="font-mono text-sky-400">{offlineQueue.length} Packets ({unsyncedCount} Pending)</span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {offlineQueue.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                            item.priority === 1
                              ? "bg-red-950 text-red-400 border border-red-800"
                              : "bg-sky-950 text-sky-400 border border-sky-800"
                          }`}
                        >
                          {item.actionType} (P{item.priority})
                        </span>
                        <span
                          className={`text-[10px] font-bold font-mono ${
                            item.synced ? "text-emerald-400" : "text-amber-400"
                          }`}
                        >
                          {item.synced ? "SYNCED" : "QUEUED"}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] truncate">
                        {JSON.stringify(item.payload)}
                      </div>
                      <div className="text-slate-500 text-[10px] font-mono">
                        {new Date(item.timestamp || item.queuedAt || Date.now()).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={handleSyncAll}
                  disabled={isSyncing || isSimulatedOffline}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSimulatedOffline
                      ? "Offline (Connect Sat Link to Sync)"
                      : isSyncing
                      ? "Transmitting to Mission Control..."
                      : `Sync Cache with Mission Control (${unsyncedCount} Queued)`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

