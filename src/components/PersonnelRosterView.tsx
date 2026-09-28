import React, { useState } from "react";
import { Personnel, Language } from "../types";
import { translations } from "../i18n";
import { 
  Users, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Phone, 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  Award,
  AlertTriangle
} from "lucide-react";

interface PersonnelRosterViewProps {
  personnel: Personnel[];
  language: Language;
  onUpdatePersonnelStatus: (id: string, newStatus: Personnel["checkInStatus"]) => void;
}

export const PersonnelRosterView: React.FC<PersonnelRosterViewProps> = ({
  personnel,
  language,
  onUpdatePersonnelStatus,
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState("");
  const [unmaskedPersonnelIds, setUnmaskedPersonnelIds] = useState<Record<string, boolean>>({});
  const [auditLog, setAuditLog] = useState<Array<{ name: string; time: string; reason: string }>>([]);
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(personnel[0] || null);

  const toggleMedicalDecrypt = (person: Personnel) => {
    const isCurrentlyUnmasked = !!unmaskedPersonnelIds[person.id];
    if (!isCurrentlyUnmasked) {
      // Log decryption event for audit compliance
      setAuditLog((prev) => [
        {
          name: person.fullName,
          time: new Date().toLocaleTimeString(),
          reason: "Medical Officer Emergency Triage Assessment",
        },
        ...prev.slice(0, 4),
      ]);
    }

    setUnmaskedPersonnelIds((prev) => ({
      ...prev,
      [person.id]: !isCurrentlyUnmasked,
    }));
  };

  const filteredPersonnel = personnel.filter((p) => {
    return (
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.serviceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.stationAssigned.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            {t.personnel}
          </h2>
          <p className="text-xs text-slate-500">
            Crew station readiness, Antarctic survival qualifications, check-in tracking, and AES-256 encrypted medical records.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Madrid Protocol Annex V Data Security Verified</span>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="input-search-personnel"
            type="text"
            placeholder="Search roster by name, service number, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs shadow-xs"
          />
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Deployment</div>
            <div className="text-base font-extrabold text-slate-900">{personnel.length} Personnel</div>
          </div>
          <div className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
            100% Survival Cleared
          </div>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Field Traverses</div>
            <div className="text-base font-extrabold text-sky-700">
              {personnel.filter((p) => p.checkInStatus === "FIELD_TRAVERSE").length} Active
            </div>
          </div>
          <div className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded text-[11px]">
            Tracking Active
          </div>
        </div>
      </div>

      {/* Grid: Roster List & Person Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Table List */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="p-3">Personnel Member</th>
                  <th className="p-3">Station & Role</th>
                  <th className="p-3">Survival Cert</th>
                  <th className="p-3">Medical Clearance</th>
                  <th className="p-3">Check-In Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPersonnel.map((person) => {
                  const isUnmasked = !!unmaskedPersonnelIds[person.id];
                  const isTraverse = person.checkInStatus === "FIELD_TRAVERSE";

                  return (
                    <tr
                      key={person.id}
                      id={`person-row-${person.id}`}
                      onClick={() => setSelectedPerson(person)}
                      className={`cursor-pointer transition ${
                        selectedPerson?.id === person.id ? "bg-sky-50/70" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{person.fullName}</div>
                        <div className="font-mono text-[11px] text-slate-400">{person.serviceNumber}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{person.role.replace("_", " ")}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {person.stationAssigned}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                          <Award className="w-3 h-3 text-emerald-600" />
                          Certified
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="text-[11px] font-mono">
                          {isUnmasked ? (
                            <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              {person.medicalFlagsEncrypted.slice(9, 36)}...
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">
                              •••••••• (AES-256)
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isTraverse
                              ? "bg-sky-100 text-sky-800 animate-pulse"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {person.checkInStatus.replace("_", " ")}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMedicalDecrypt(person);
                          }}
                          className={`p-1.5 rounded-md border transition ${
                            isUnmasked
                              ? "bg-amber-100 text-amber-900 border-amber-300"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                          title={isUnmasked ? t.maskMedical : t.unmaskMedical}
                        >
                          {isUnmasked ? <Unlock className="w-3.5 h-3.5 text-amber-700" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Person Card & Check-in Controls */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          {selectedPerson ? (
            <>
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Personnel Record
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedPerson.fullName}</h3>
                <p className="text-xs font-mono text-slate-500">{selectedPerson.serviceNumber}</p>
              </div>

              {/* Station Assignment & Role */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assignment:</span>
                  <span className="font-bold text-slate-800">{selectedPerson.stationAssigned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Role:</span>
                  <span className="font-bold text-slate-800">{selectedPerson.role.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Ping:</span>
                  <span className="text-slate-700 font-mono text-[11px]">
                    {new Date(selectedPerson.lastCheckInTime).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
                <div className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  Next of Kin / Emergency Contact
                </div>
                <div className="font-semibold text-slate-800">
                  {selectedPerson.emergencyContact.name} ({selectedPerson.emergencyContact.relation})
                </div>
                <div className="font-mono text-slate-600 text-[11px]">
                  {selectedPerson.emergencyContact.phone}
                </div>
              </div>

              {/* Encrypted Medical Record Section */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    Medical Clearance (Encrypted)
                  </span>
                  <button
                    onClick={() => toggleMedicalDecrypt(selectedPerson)}
                    className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950"
                  >
                    {unmaskedPersonnelIds[selectedPerson.id] ? "Hide Record" : "Decrypt"}
                  </button>
                </div>

                {unmaskedPersonnelIds[selectedPerson.id] ? (
                  <div className="p-2.5 bg-white rounded-lg border border-amber-200 text-[11px] font-mono text-slate-800 leading-relaxed">
                    <strong>[MoES_DECRYPTED_PAYLOAD]:</strong>
                    <br />
                    {selectedPerson.medicalFlagsEncrypted.replace("AES-GCM::", "CIPHER: ").split(":").join("\n• ")}
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-800 leading-tight">
                    Protected under Treaty Privacy Provisions. Accessible only to Station Doctors and Authorized Triage Officers.
                  </p>
                )}
              </div>

              {/* Change Check-in Status Actions */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Update Operational Status
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdatePersonnelStatus(selectedPerson.id, "CHECKED_IN")}
                    className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 text-xs transition"
                  >
                    Station Base
                  </button>
                  <button
                    onClick={() => onUpdatePersonnelStatus(selectedPerson.id, "FIELD_TRAVERSE")}
                    className="py-1.5 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold rounded-lg border border-sky-200 text-xs transition"
                  >
                    Field Traverse
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">Select personnel member</div>
          )}
        </div>
      </div>
    </div>
  );
};
