import React, { useState } from "react";
import { InventoryItem, Language } from "../types";
import { translations } from "../i18n";
import { 
  Boxes, 
  AlertCircle, 
  Clock, 
  Thermometer, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  ShieldAlert, 
  ShoppingBag,
  Layers
} from "lucide-react";

interface InventoryViewProps {
  inventory: InventoryItem[];
  language: Language;
  onAddItem: (item: Partial<InventoryItem>) => void;
  onReplenish: (sku: string, amount: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  language,
  onAddItem,
  onReplenish,
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<InventoryItem["category"]>("RATIONS_COLD_CHAIN");
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState("Packs");
  const [minThreshold, setMinThreshold] = useState(25);
  const [expiryDate, setExpiryDate] = useState("2027-12-31");
  const [storageTempC, setStorageTempC] = useState("-20°C");
  const [location, setLocation] = useState("Maitri Cold Bay 1");

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchLot.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const expiringCount = inventory.filter((i) => i.status === "EXPIRING_SOON" || i.status === "EXPIRED").length;
  const reorderCount = inventory.filter((i) => i.status === "REORDER_TRIGGERED" || i.quantity <= i.minThreshold).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem({
      sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
      name,
      category,
      quantity,
      unit,
      minThreshold,
      expiryDate,
      storageTempC,
      location,
      batchLot: `LOT-POLAR-${Date.now().toString().slice(-4)}`,
    });
    setShowAddModal(false);
    setName("");
    setSku("");
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & KPI Alerts */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-sky-600" />
            {t.inventory}
          </h2>
          <p className="text-xs text-slate-500">
            Automated SKU/lot tracking, extreme sub-zero cold-chain verification, and critical reorder threshold monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-open-add-sku"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inventory SKU</span>
          </button>
        </div>
      </div>

      {/* Threshold & Expiry Warning Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total SKUs Monitored</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{inventory.length} SKUs</div>
            <div className="text-[10px] text-slate-500">Across 3 Polar Stations</div>
          </div>
          <div className="p-2.5 rounded-lg bg-sky-50 text-sky-700">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`p-3.5 rounded-xl border shadow-xs flex items-center justify-between ${
            reorderCount > 0 ? "bg-amber-500/10 border-amber-300" : "bg-white border-slate-200"
          }`}
        >
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-800">Reorder Rule Triggered</div>
            <div className="text-xl font-extrabold text-amber-900 mt-0.5">{reorderCount} Items</div>
            <div className="text-[10px] text-amber-700 font-medium">Below safety threshold</div>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`p-3.5 rounded-xl border shadow-xs flex items-center justify-between ${
            expiringCount > 0 ? "bg-red-500/10 border-red-300" : "bg-white border-slate-200"
          }`}
        >
          <div>
            <div className="text-[10px] uppercase font-bold text-red-800">Expiry Alert (&lt; 30 Days)</div>
            <div className="text-xl font-extrabold text-red-900 mt-0.5">{expiringCount} Lots</div>
            <div className="text-[10px] text-red-700 font-medium">Immediate rotation required</div>
          </div>
          <div className="p-2.5 rounded-lg bg-red-100 text-red-800">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            id="input-inventory-search"
            type="text"
            placeholder="Search by SKU, batch, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            id="select-inventory-category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
          >
            <option value="ALL">All Item Classes</option>
            <option value="RATIONS_COLD_CHAIN">Cold-Chain Rations</option>
            <option value="MEDICAL_SUPPLIES">Medical & Frostbite Trauma</option>
            <option value="FUEL_LUBRICANTS">Polar Jet/Diesel Fuel</option>
            <option value="SPARE_PARTS">Vehicle & Snowcat Spares</option>
            <option value="SURVIVAL_GEAR">Geodesic Tents & Survival</option>
          </select>
        </div>
      </div>

      {/* Table of Inventory */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <th className="p-3">SKU & Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Quantity & Unit</th>
                <th className="p-3">Reorder Threshold</th>
                <th className="p-3">Storage Temp & Bay</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isBelowMin = item.quantity <= item.minThreshold;
                const isExpiring = item.status === "EXPIRING_SOON" || item.status === "EXPIRED";

                return (
                  <tr key={item.sku} id={`inventory-row-${item.sku}`} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="font-mono text-[11px] text-slate-400">
                        {item.sku} | Batch: {item.batchLot}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.category}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-sm">
                        {item.quantity.toLocaleString()} {item.unit}
                      </div>
                    </td>

                    <td className="p-3">
                      <div
                        className={`font-mono font-medium ${
                          isBelowMin ? "text-amber-700 font-bold" : "text-slate-600"
                        }`}
                      >
                        Min: {item.minThreshold} {item.unit}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-700 font-medium flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-sky-600" />
                        <span>{item.storageTempC}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{item.location}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-mono text-slate-700">{item.expiryDate}</div>
                      {item.daysUntilExpiry !== undefined && item.daysUntilExpiry > 0 && (
                        <div className="text-[10px] text-slate-400">{item.daysUntilExpiry} days left</div>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isExpiring
                            ? "bg-red-100 text-red-800"
                            : isBelowMin
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isExpiring ? "EXPIRING SOON" : isBelowMin ? "REORDER REQUIRED" : "IN STOCK"}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => onReplenish(item.sku, 50)}
                        className="px-2.5 py-1 text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-md hover:bg-sky-100 transition"
                      >
                        + Restock 50
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add SKU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Inventory SKU</h3>
            <p className="text-slate-500 mb-4">Register cold-chain consumable or critical expedition spare.</p>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">SKU Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RAT-CAL-5000-B"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Altitude Expedition Freeze Dried Rations"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="RATIONS_COLD_CHAIN">Cold-Chain Rations</option>
                    <option value="MEDICAL_SUPPLIES">Medical Supplies</option>
                    <option value="FUEL_LUBRICANTS">Fuel & FSII Lubricants</option>
                    <option value="SPARE_PARTS">Mechanical Spares</option>
                    <option value="SURVIVAL_GEAR">Survival Gear</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Reorder Safety Threshold</label>
                  <input
                    type="number"
                    min={1}
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cold Chain Temp (°C)</label>
                  <input
                    type="text"
                    value={storageTempC}
                    onChange={(e) => setStorageTempC(e.target.value)}
                    placeholder="-20°C"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Depot Storage Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
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
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
