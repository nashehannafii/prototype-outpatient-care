import React, { useState, useEffect } from 'react';
import { Heart, User, Calendar, Activity, AlertCircle, FileText, Clock, TrendingUp, Pill, ClipboardCheck, ChevronRight } from 'lucide-react';

const HeartCarePatientPlanner = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3333/data');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setPatients(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load data');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPatients();
    return () => { mounted = false; };
  }, []);

  const PatientCard = ({ patient }) => {
    const riskColors = {
      'Tinggi': 'bg-red-100 border-red-300 text-red-800',
      'Sangat Tinggi': 'bg-red-200 border-red-400 text-red-900',
      'Sedang': 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'Sedang-Tinggi': 'bg-orange-100 border-orange-300 text-orange-800'
    };

    const translateRisk = (label: any) => {
      switch (label) {
        case 'Tinggi':
          return 'High';
        case 'Sangat Tinggi':
          return 'Very High';
        case 'Sedang':
          return 'Moderate';
        case 'Sedang-Tinggi':
          return 'Moderate-High';
        default:
          return label || '';
      }
    };

    return (
      <div
        onClick={() => setSelectedPatient(patient)}
        className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg cursor-pointer transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${riskColors[patient.riskLevel]}`}>
                {translateRisk(patient.riskLevel)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div><span className="font-medium">MRN:</span> {patient.mrn}</div>
              <div><span className="font-medium">Age:</span> {patient.age} yrs ({patient.gender})</div>
              <div><span className="font-medium">Room:</span> {patient.room}</div>
              <div><span className="font-medium">Admission:</span> {patient.admissionDate}</div>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </div>
        
        <div className="border-t pt-3 mt-3">
          <p className="font-semibold text-gray-900 mb-1">Diagnosis:</p>
          <p className="text-gray-700">{patient.diagnosis}</p>
          <p className="text-sm text-gray-600 mt-2 italic">"{patient.chiefComplaint}"</p>
        </div>
      </div>
    );
  };

  const PatientDetail = ({ patient }) => {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between border-b pb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{patient.name}</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-gray-700">
              <div><span className="font-medium">MRN:</span> {patient.mrn}</div>
              <div><span className="font-medium">Room:</span> {patient.room}</div>
              <div><span className="font-medium">Age/Gender:</span> {patient.age} years / {patient.gender}</div>
              <div><span className="font-medium">Admission Date:</span> {patient.admissionDate}</div>
            </div>
            <div className="mt-3">
              <p className="text-lg font-semibold text-gray-900">{patient.diagnosis}</p>
              <p className="text-gray-600 italic mt-1">Chief Complaint: {patient.chiefComplaint}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedPatient(null)}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
          >
            ← Back to List
          </button>
        </div>

        {/* Clinical Parameters */}
        <div className="grid grid-cols-4 gap-4">
          {patient.ejectionFraction && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium mb-1">Ejection Fraction</p>
              <p className="text-2xl font-bold text-blue-900">{patient.ejectionFraction}%</p>
            </div>
          )}
          {patient.nyhaClass && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-700 font-medium mb-1">NYHA Class</p>
              <p className="text-2xl font-bold text-purple-900">{patient.nyhaClass}</p>
            </div>
          )}
          {patient.heartRate && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 font-medium mb-1">Heart Rate</p>
              <p className="text-lg font-bold text-red-900">{patient.heartRate}</p>
            </div>
          )}
          {patient.chadScore && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-700 font-medium mb-1">CHA₂DS₂-VASc</p>
              <p className="text-2xl font-bold text-orange-900">{patient.chadScore}</p>
            </div>
          )}
        </div>

        {/* Lab Results */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Latest Laboratory Results
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(patient.labs).map(([key, value]) => (
              <div key={key} className="bg-white p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-600 uppercase mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Medications */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5 text-purple-600" />
            Medication Therapy
          </h3>
          <div className="space-y-3">
            {patient.medications.map((med, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-purple-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900">{med.name}</h4>
                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {med.dose}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Frequency: {med.frequency}</p>
                <p className="text-sm text-gray-700 italic">{med.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Care Plan - Monitoring */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            Monitoring & Observation
          </h3>
          <div className="space-y-2">
            {patient.carePlan.monitoring.map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-3 rounded border border-blue-100">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Care Plan - Dietary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Nutrition Management
          </h3>
          <div className="space-y-2">
            {patient.carePlan.dietary.map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-3 rounded border border-green-100">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Care Plan - Activities */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Activity & Mobilization
          </h3>
          <div className="space-y-2">
            {patient.carePlan.activities.map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-3 rounded border border-orange-100">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Care Plan - Education */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Patient & Family Education
          </h3>
          <div className="space-y-2">
            {patient.carePlan.education.map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-3 rounded border border-indigo-100">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Follow Up Plan */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-600" />
            Follow-Up Plan
          </h3>
          <div className="bg-white p-4 rounded border border-yellow-100">
            <p className="text-gray-800 font-medium">{patient.carePlan.followUp}</p>
          </div>
        </div>

        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-700 text-center">
            <strong>Note:</strong> This care plan should be individualized based on the patient's clinical response and periodic evaluations.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-600 rounded-lg shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Cardiovascular Patient Care Plan</h1>
              <p className="text-gray-600 text-lg">Clinician Dashboard - Inpatient Management</p>
            </div>
          </div>
        </header>

        
        <nav className="mb-6">
          <ul className="flex gap-3">
            {['Dashboard', 'Outpatient Care', 'Other Menus'].map((item, idx) => (
              <li key={`${item}-${idx}`}>
                <button
                  onClick={() => setActiveMenu(item)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeMenu === item ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {activeMenu.startsWith('Other') ? (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <p className="text-gray-400">Empty menu</p>
          </div>
        ) : (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {!selectedPatient ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Active Patients</h2>
                  <p className="text-gray-600">Total: {patients.length} patients in care</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Last Updated: {new Date().toLocaleDateString('en-US')}</span>
                </div>
              </div>
              
              <div className="grid gap-4">
                {loading ? (
                  <div className="p-8 text-center text-gray-600">Loading patients...</div>
                ) : error ? (
                  <div className="p-8 text-center text-red-600">Failed to load data: {error}</div>
                ) : patients.length === 0 ? (
                  <div className="p-8 text-center text-gray-600">No patients.</div>
                ) : (
                  patients.map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <PatientDetail patient={selectedPatient} />
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default HeartCarePatientPlanner;