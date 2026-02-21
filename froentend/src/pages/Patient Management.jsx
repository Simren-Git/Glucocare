import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  FileText,
  Utensils,
  Calendar,
  Search,
  Plus,
  TrendingUp,
  User,
  Filter,
  Heart,
  LogOut,
  Bell,
  ArrowLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const doctorUserId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (!doctorUserId) return;
    axios
      .get(`http://127.0.0.1:8000/api/doctor/patients/${doctorUserId}/`)
      .then(res => setPatients(res.data))
      .catch(err => console.error("API ERROR:", err));
  }, [doctorUserId]);

  const filteredPatients = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/doctor-login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white p-2 rounded-lg">
              <Heart className="text-gray-900" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-semibold">DiabeteCare</h1>
              <p className="text-xs text-gray-400">Doctor Portal</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => navigate("/doctor-dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-all text-sm font-medium"
            >
              <Activity size={18} />
              <span>Dashboard</span>
            </button>

            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700">
              <User size={18} />
              <span className="font-medium text-sm">Patients</span>
            </div>

            <button 
              onClick={() => navigate("/appointment-page")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-all text-sm font-medium"
            >
              <Calendar size={18} />
              <span>Appointments</span>
            </button>

            <button 
              onClick={() => navigate("/glucose-management")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-all text-sm font-medium"
            >
              <TrendingUp size={18} />
              <span>Glucose Monitor</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-800">
          <button
            onClick={() => navigate("/patient-registration")}
            className="w-full bg-white text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={18} />
            Add Patient
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="px-8 py-4 flex justify-between items-center">
            <button
              onClick={() => navigate("/doctor-dashboard")}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors group text-sm"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">Patient Management</h1>
                <p className="text-gray-500">Monitor and manage all your patients</p>
              </div>
              <button 
                onClick={() => navigate("/patient-registration")}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                New Patient
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-sm text-gray-500 mb-1">Total Patients</p>
                <p className="text-3xl font-light text-gray-900">{patients.length}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-sm text-gray-500 mb-1">Active Cases</p>
                <p className="text-3xl font-light text-gray-900">{patients.length}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-sm text-gray-500 mb-1">This Month</p>
                <p className="text-3xl font-light text-gray-900">{patients.filter(p => p.last_visit).length}</p>
              </div>
            </div>

            {/* Patient List */}
            {filteredPatients.length === 0 ? (
              <div className="bg-white rounded-lg p-20 text-center border border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="text-gray-400" size={40} />
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-2">No patients found</h3>
                <p className="text-gray-500 mb-8">Start by adding a new patient to your roster</p>
                <button 
                  onClick={() => navigate("/patient-registration")}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add First Patient
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPatients.map((patient) => (
                  <div 
                    key={patient.patient_id} 
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      {/* Patient Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-lg">
                          {patient.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{patient.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{patient.age} years</span>
                            <span>•</span>
                            <span className="capitalize">{patient.gender}</span>
                            {patient.avg_glucose && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp size={14} />
                                  {patient.avg_glucose} mg/dL
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/blood-glucose/${patient.user_id}`)}
                          className="px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-all text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Glucose
                        </button>

                        <button
                          onClick={() => navigate(`/create-treatment-plan/${patient.user_id}`)}
                          className="px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-all text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Treatment
                        </button>

                        <button
                          onClick={() => navigate(`/create-diet-plan/${patient.user_id}`)}
                          className="px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-all text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Diet
                        </button>

                        <button
                          onClick={() => navigate(`/schedule-appointment/${patient.user_id}`)}
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium flex items-center gap-2"
                        >
                          <Calendar size={16} />
                          Schedule
                        </button>

                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={20} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientManagement;