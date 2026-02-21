import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import DiabetesCareWebsite from "./pages/DiabetesCareWebsite";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientRegistration from "./pages/PatientRegistration";
import PatientLogin from "./pages/PatientLogin";
import PatientDashboard from "./pages/Patient Dashboard";
import BGLoggingModule from "./pages/Patient Blood Glucose";
import AppointmentScheduler from "./pages/AppointmentScheduler";
import PatientManagement from "./pages/Patient Management";
import AppointmentPage from "./pages/AppointmentPage";
import GlucoseManagementPage from "./pages/GlucoseManagementPage";

import DietPlanPage from "./pages/DietPlanPage";
import TreatmentPlanPage from "./pages/TreatmentPlanPage";
import CreateDietPlan from "./pages/CreateDietPlan";
import CreateTreatmentPlan from "./pages/CreateTreatmentPlan";
import BloodGlucoseManagement from "./pages/BloodGlucoseManagement";
import MyDietPlan from "./pages/MyDietPlan";
import MyTreatmentPlan from "./pages/MyTreatmentPlan";
import PatientGlucoseHistory from "./pages/PatientGlucoseHistory";
import PatientGlucoseGraph from "./pages/PatientGlucoseGraph";
import PatientMedicalAdvice from "./pages/PatientMedicalAdvice";
import DoctorMedicalAdvice from "./pages/DoctorMedicalAdvice";
import MyAppointments from "./pages/MyAppointments";

function App() {
  const DoctorRoute = ({ children }) => {
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("user_id");
    if (role !== "doctor" || !userId) {
      return <Navigate to="/doctor-login" replace />;
    }
    return children;
  };
  const PatientRoute = ({ children }) => {
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("user_id");
    if (role !== "patient" || !userId) {
      return <Navigate to="/patient-login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DiabetesCareWebsite />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route
          path="/doctor-dashboard"
          element={
            <DoctorRoute>
              <DoctorDashboard />
            </DoctorRoute>
          }
        />
        <Route path="/patient-registration" element={<PatientRegistration />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route
          path="/patient-dashboard"
          element={
            <PatientRoute>
              <PatientDashboard />
            </PatientRoute>
          }
        />
        <Route
          path="/bg-logging"
          element={
            <PatientRoute>
              <BGLoggingModule />
            </PatientRoute>
          }
        />
        <Route path="/appointments" element={<AppointmentScheduler />} />
        <Route path="/patient-management" element={<PatientManagement />} />
        <Route path="/appointment-page" element={<AppointmentPage />} />
        <Route path="/glucose-management" element={<GlucoseManagementPage />} />

        {/* DIET */}
        <Route path="/diet-plan" element={<DietPlanPage />} />
        <Route path="/diet-plan/:userId" element={<DietPlanPage />} />
        <Route path="/create-diet-plan/:patientId" element={<CreateDietPlan />} />

        {/* TREATMENT */}
        <Route path="/treatment-plan" element={<TreatmentPlanPage />} />
        <Route
          path="/create-treatment-plan/:patientId"
          element={<CreateTreatmentPlan />}
        />

        {/* BLOOD GLUCOSE */}
        <Route
          path="/blood-glucose/:userId"
          element={<BloodGlucoseManagement />}
        />

        <Route
          path="/blood-sugar-history/:userId"
          element={<BloodGlucoseManagement />}
        />

        {/* APPOINTMENT */}
        <Route
          path="/schedule-appointment/:patientUserId"
          element={<AppointmentScheduler />}
        />

        {/* PATIENT */}
        <Route
          path="/my-diet-plan"
          element={
            <PatientRoute>
              <MyDietPlan />
            </PatientRoute>
          }
        />
        <Route
          path="/my-treatment-plan"
          element={
            <PatientRoute>
              <MyTreatmentPlan />
            </PatientRoute>
          }
        />
        <Route
          path="/patient-glucose-history"
          element={
            <PatientRoute>
              <PatientGlucoseHistory />
            </PatientRoute>
          }
        />
        <Route
          path="/glucose-graph"
          element={
            <PatientRoute>
              <PatientGlucoseGraph />
            </PatientRoute>
          }
        />
        <Route
          path="/medical-advice"
          element={
            <PatientRoute>
              <PatientMedicalAdvice />
            </PatientRoute>
          }
        />

        {/* DOCTOR */}
        <Route
          path="/doctor/medical-advice"
          element={
            <DoctorRoute>
              <DoctorMedicalAdvice />
            </DoctorRoute>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <PatientRoute>
              <MyAppointments />
            </PatientRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
