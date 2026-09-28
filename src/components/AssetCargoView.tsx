import React, { useState, useEffect } from "react";
import { Asset, Language } from "../types";
import { translations } from "../i18n";
import { 
  Package, 
  QrCode, 
  Radio, 
  Thermometer, 
  BatteryCharging, 
  Activity, 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Scan, 
  Clock,
  ShieldCheck,
  Truck
} from "lucide-react";

interface AssetCargoViewProps {
  assets: Asset[];
  language: Language;
  onUpdateAsset: (asset: Asset) => void;
  onAddNewAsset: (newAsset: Partial<Asset>) => void;
}

export const AssetCargoView: React.FC<AssetCargoViewProps> = ({
  assets,
  language,
  onUpdateAsset,
  onAddNewAsset,
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(assets[0] || null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [newHolderName, setNewHolderName] = useState("");
  const [transferStation, setTransferStation] = useState("Maitri Operations Apron");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!selectedAsset && assets.length > 0) {
      setSelectedAsset(assets[0]);
    }
  }, [assets, selectedAsset]);

  // New Asset Form
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Asset["category"]>("CARGO_SLEDGE");

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.chainOfCustody.currentHolder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCustodyTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    const updated: Asset = {
      ...selectedAsset,
      currentLocationName: transferStation,
      chainOfCustody: {
        ...selectedAsset.chainOfCustody,
        currentHolder: newHolderName || "Officer On Duty",
        lastVerifiedAt: new Date().toISOString(),
      },
    };

    onUpdateAsset(updated);
    setSelectedAsset(updated);
    setShowTransferModal(false);
    setNewHolderName("");
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNewAsset({
      code: newCode || `AST-${Date.now().toString().slice(-4)}`,
      name: newName || "New Sledge Unit",
      category: newCategory,
      currentLocationName: "Bharati Storage Apron",
      latitude: -69.41,
      longitude: 76.19,
    });
    setShowAddModal(false);
    setNewCode("");
    setNewName("");
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-sky-600" />
            {t.assetCargo}
          </h2>
          <p className="text-xs text-slate-500">
            Real-time condition telemetry, digital chain-of-custody transfer logs, and polar RFID/QR integration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-open-add-asset"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register Asset</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            id="input-asset-search"
            type="text"
            placeholder="Search by code, custodian, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            id="select-asset-category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">All Categories</option>
            <option value="VESSEL">Polar Vessels</option>
            <option value="SNOWCAT_PISTENBULLY">PistenBully Snowcats</option>
            <option value="SNOWMOBILE">Snowmobiles</option>
            <option value="AWS_WEATHER_STATION">Weather Stations (AWS)</option>
            <option value="CARGO_SLEDGE">Traverse Sledges</option>
            <option value="DRONE_UAV">UAVs & Drones</option>
          </select>
        </div>
      </div>

      {/* Grid: Assets Table & Custody Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Table List */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="p-3">Asset Code & Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Sensors (Temp / Shock)</th>
                  <th className="p-3">Battery</th>
                  <th className="p-3">Current Custodian</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    id={`asset-row-${asset.id}`}
                    onClick={() => setSelectedAsset(asset)}
                    className={`cursor-pointer transition ${
                      selectedAsset?.id === asset.id ? "bg-sky-50/70" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{asset.name}</div>
                      <div className="font-mono text-[11px] text-slate-400">{asset.code}</div>
                    </td>

                    <td className="p-3">
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {asset.category}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-mono font-medium text-slate-800 flex items-center gap-2">
                        <span className="flex items-center gap-0.5 text-sky-700">
                          <Thermometer className="w-3 h-3" />
                          {asset.temperatureC.toFixed(1)}°C
                        </span>
                        <span className="text-slate-300">|</span>
                        <span
                          className={`flex items-center gap-0.5 ${
                            asset.shockG > 1.0 ? "text-red-600 font-bold" : "text-slate-600"
                          }`}
                        >
                          <Activity className="w-3 h-3 text-amber-500" />
                          {asset.shockG.toFixed(2)}G
                        </span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1.5 font-mono text-emerald-700 font-semibold">
                        <BatteryCharging className="w-3.5 h-3.5" />
                        <span>{asset.batteryPct}%</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-800 font-medium line-clamp-1">
                        {asset.chainOfCustody.currentHolder}
                      </div>
                      <div className="text-[10px] text-slate-400">{asset.currentLocationName}</div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          asset.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : asset.status === "ALERT"
                            ? "bg-red-100 text-red-800 animate-pulse"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAsset(asset);
                          setShowQrModal(true);
                        }}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                        title="View QR Code & RFID Tag"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Asset Custody & RFID Details Card */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          {selectedAsset ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Chain-of-Custody Dossier
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedAsset.name}</h3>
                <p className="text-xs font-mono text-slate-500">{selectedAsset.code}</p>
              </div>

              {/* Tag Identifiers */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">RFID Tag ID:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedAsset.chainOfCustody.rfidTag}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">QR Registry Token:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedAsset.chainOfCustody.qrCode}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Last Verified:</span>
                  <span className="text-[11px] text-slate-600">
                    {new Date(selectedAsset.chainOfCustody.lastVerifiedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Handover of Custody Action */}
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 space-y-2 text-xs">
                <div className="font-bold text-sky-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-700" />
                  Custodian Verification
                </div>
                <p className="text-slate-600 text-[11px]">
                  Currently in physical care of <strong>{selectedAsset.chainOfCustody.currentHolder}</strong>.
                  Transfer custody upon arrival at intermediate polar camps.
                </p>
                <button
                  id="btn-transfer-custody"
                  onClick={() => setShowTransferModal(true)}
                  className="w-full py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition"
                >
                  Transfer Chain of Custody
                </button>
              </div>

              {/* QR Tag Preview Button */}
              <button
                onClick={() => setShowQrModal(true)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center justify-center gap-2 text-xs border border-slate-200 transition"
              >
                <QrCode className="w-4 h-4 text-slate-600" />
                <span>Generate Printable QR & RFID Label</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">Select an asset to inspect</div>
          )}
        </div>
      </div>

      {/* Modal: QR Code & RFID Tag Generator */}
      {showQrModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <h3 className="text-base font-bold text-slate-900">Digital Cargo Tag</h3>
            <p className="text-xs text-slate-500 mb-4">Ministry of Earth Sciences Polar Tag Standards</p>

            {/* Simulated Pixel-Perfect QR Code SVG */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl inline-block mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-40 h-40">
                <rect width="100" height="100" fill="#FFFFFF" />
                {/* Corner squares */}
                <rect x="10" y="10" width="25" height="25" fill="#0F172A" />
                <rect x="15" y="15" width="15" height="15" fill="#FFFFFF" />
                <rect x="18" y="18" width="9" height="9" fill="#0F172A" />

                <rect x="65" y="10" width="25" height="25" fill="#0F172A" />
                <rect x="70" y="15" width="15" height="15" fill="#FFFFFF" />
                <rect x="73" y="18" width="9" height="9" fill="#0F172A" />

                <rect x="10" y="65" width="25" height="25" fill="#0F172A" />
                <rect x="15" y="70" width="15" height="15" fill="#FFFFFF" />
                <rect x="18" y="73" width="9" height="9" fill="#0F172A" />

                {/* Simulated Data dots */}
                <rect x="42" y="15" width="5" height="5" fill="#0284C7" />
                <rect x="50" y="25" width="5" height="5" fill="#0F172A" />
                <rect x="40" y="40" width="20" height="20" fill="#0F172A" />
                <rect x="45" y="45" width="10" height="10" fill="#FFFFFF" />
                <rect x="68" y="45" width="6" height="6" fill="#0284C7" />
                <rect x="45" y="72" width="8" height="8" fill="#0F172A" />
                <rect x="75" y="75" width="10" height="10" fill="#0F172A" />
              </svg>
            </div>

            <div className="text-xs font-mono font-bold text-slate-800">{selectedAsset.code}</div>
            <div className="text-[11px] font-mono text-slate-500 mb-4">{selectedAsset.chainOfCustody.rfidTag}</div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Modal: Transfer Chain of Custody */}
      {showTransferModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Transfer Chain of Custody</h3>
            <p className="text-xs text-slate-500 mb-4">
              Sign over responsibility for {selectedAsset.name} ({selectedAsset.code})
            </p>

            <form onSubmit={handleCustodyTransfer} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">New Custodian / Field Operator</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Er. Tenzin Norbu (Logistics Lead)"
                  value={newHolderName}
                  onChange={(e) => setNewHolderName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Station / Waypoint Location</label>
                <input
                  type="text"
                  required
                  value={transferStation}
                  onChange={(e) => setTransferStation(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs transition"
                >
                  Record Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register New Asset */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Register New Polar Asset</h3>
            <p className="text-xs text-slate-500 mb-4">Add to central MoES inventory and allocate RFID tags.</p>

            <form onSubmit={handleCreateAsset} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Asset Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SLEDGE-POLAR-09"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Duty Lehmann Polar Sledge (Unit 9)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="CARGO_SLEDGE">Traverse Cargo Sledge</option>
                  <option value="SNOWMOBILE">Polar Snowmobile</option>
                  <option value="SNOWCAT_PISTENBULLY">PistenBully Snowcat</option>
                  <option value="AWS_WEATHER_STATION">Automatic Weather Station (AWS)</option>
                  <option value="DRONE_UAV">Drone / UAV</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs transition"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
