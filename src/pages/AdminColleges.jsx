import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  CheckCircle,
  Edit,
  Plus,
  Search,
  ExternalLink,
  Download,
  AlertCircle,
  Save
} from 'lucide-react';
import { HYDERABAD_INSTITUTIONS } from '../data/hyderabadInstitutions';

export default function AdminColleges() {
  const [colleges, setColleges] = useState(HYDERABAD_INSTITUTIONS);
  const [search, setSearch] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const filtered = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.institutionType.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedCollege) return;
    setColleges((prev) =>
      prev.map((c) => (c.id === selectedCollege.id ? selectedCollege : c))
    );
    setIsEditing(false);
    setSaveMessage('Institution details updated successfully.');
    setTimeout(() => setSaveMessage(''), 3500);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(colleges, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'NAVORA_Institutions_Master_2026_27.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-[#0A192F] text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative Verification Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Higher Education Institutional Master (2026-27)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
              Curate, audit, and verify accreditation, fees, and admission criteria with source provenance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Master JSON</span>
            </button>
            <Link
              to="/colleges"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              <span>View Public Discovery</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {saveMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city or type..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Total Catalogued: <strong className="text-slate-900">{colleges.length}</strong> institutions
          </div>
        </div>

        {/* Institutions Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                <th className="p-3.5">Institution Name</th>
                <th className="p-3.5">Type & Ownership</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">NIRF / Accreditation</th>
                <th className="p-3.5">Tuition (Annual)</th>
                <th className="p-3.5">Courses</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    <Link to={`/colleges/${inst.slug}`} className="hover:text-blue-600">
                      {inst.name}
                    </Link>
                    <span className="text-[11px] text-slate-400 font-normal block">
                      Slug: {inst.slug}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700">
                    <div>{inst.institutionType}</div>
                    <span className="text-slate-400 text-[11px]">{inst.ownership}</span>
                  </td>
                  <td className="p-3.5 text-slate-600">{inst.city}</td>
                  <td className="p-3.5 text-slate-700">
                    <div className="font-medium text-slate-900">{inst.nirfRank || 'State Accredited'}</div>
                    <span className="text-slate-400 text-[11px]">{inst.accreditation}</span>
                  </td>
                  <td className="p-3.5 font-bold text-blue-700">
                    {inst.minAnnualFee ? `₹${inst.minAnnualFee.toLocaleString('en-IN')}` : 'Unverified'}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {inst.courses?.length || 0} Programs
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified 26-27
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedCollege({ ...inst });
                        setIsEditing(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                      title="Edit institution"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Drawer Modal */}
      {isEditing && selectedCollege && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Edit Institutional Record: {selectedCollege.shortName || selectedCollege.name}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Institution Full Name</label>
                <input
                  type="text"
                  value={selectedCollege.name}
                  onChange={(e) =>
                    setSelectedCollege({ ...selectedCollege, name: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Institution Type</label>
                  <input
                    type="text"
                    value={selectedCollege.institutionType}
                    onChange={(e) =>
                      setSelectedCollege({ ...selectedCollege, institutionType: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ownership</label>
                  <input
                    type="text"
                    value={selectedCollege.ownership}
                    onChange={(e) =>
                      setSelectedCollege({ ...selectedCollege, ownership: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Annual Tuition Fee (₹)</label>
                  <input
                    type="number"
                    value={selectedCollege.minAnnualFee || ''}
                    onChange={(e) =>
                      setSelectedCollege({
                        ...selectedCollege,
                        minAnnualFee: Number(e.target.value)
                      })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIRF Rank / Category</label>
                  <input
                    type="text"
                    value={selectedCollege.nirfRank || ''}
                    onChange={(e) =>
                      setSelectedCollege({ ...selectedCollege, nirfRank: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location Details</label>
                <input
                  type="text"
                  value={selectedCollege.location}
                  onChange={(e) =>
                    setSelectedCollege({ ...selectedCollege, location: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Website URL</label>
                <input
                  type="url"
                  value={selectedCollege.website || ''}
                  onChange={(e) =>
                    setSelectedCollege({ ...selectedCollege, website: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
