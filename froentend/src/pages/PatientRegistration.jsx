import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Heart,
  AlertCircle,
  Check,
  ArrowLeft,
  Loader,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function PatientRegistration() {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem("user_id");

  // 🚨 Doctor must be logged in
  if (!doctorId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-gray-400" size={40} />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-3">Access Denied</h2>
          <p className="text-gray-600 mb-8">
            Please log in to continue with patient registration.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  // ---------------- HANDLE INPUT ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient_name.trim())
      newErrors.patient_name = "Patient name is required";
    else if (formData.patient_name.trim().length < 2)
      newErrors.patient_name = "Name must be at least 2 characters";

    if (!formData.age || formData.age < 1 || formData.age > 120)
      newErrors.age = "Valid age is required (1-120)";

    if (!formData.gender)
      newErrors.gender = "Gender is required";

    if (!formData.email)
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phone)
      newErrors.phone = "Phone number is required";
    else if (!/^\d{10,15}$/.test(formData.phone.replace(/[-()\s]/g, "")))
      newErrors.phone = "Invalid phone number";

    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  };

  // Check if field is valid
  const isFieldValid = (field) => {
    return touched[field] && formData[field] && !errors[field];
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      const allTouched = {};
      Object.keys(formData).forEach(key => allTouched[key] = true);
      setTouched(allTouched);
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/register-patient/",
        {
          doctor_id: Number(doctorId),
          patient_name: formData.patient_name,
          age: Number(formData.age),
          gender: formData.gender,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      setSuccess(true);

      setTimeout(() => {
        navigate("/doctor-dashboard");
      }, 2500);

    } catch (err) {
      console.error(err.response?.data || err.message);
      setErrors({
        submit: err.response?.data?.error || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SUCCESS SCREEN ----------------
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-200 text-center max-w-lg w-full animate-fadeIn">
          <div className="relative mb-8">
            <div className="w-28 h-28 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
              <Check className="text-white" size={56} />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
              <div className="w-14 h-14 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="text-gray-900" size={28} />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            Registration Complete
          </h2>
          <p className="text-gray-600 mb-2 text-lg">
            <span className="font-medium text-gray-900">{formData.patient_name}</span> has been successfully registered.
          </p>
          <p className="text-sm text-gray-500 mb-10">
            Patient credentials have been created and are ready to use.
          </p>
          
          <div className="flex justify-center items-center gap-3 text-gray-600">
            <Loader className="animate-spin" size={20} />
            <span className="font-medium">Returning to dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate form progress
  const filledFields = Object.values(formData).filter(val => val.trim() !== "").length;
  const progress = (filledFields / Object.keys(formData).length) * 100;
  const isFormComplete = progress === 100;

  // ---------------- FORM UI ----------------
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/doctor-dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 p-10 text-white">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <UserPlus size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-light text-center mb-3">Patient Registration</h1>
            <p className="text-center text-white/70 text-sm">
              Add a new patient to your practice
            </p>
            
            {/* Progress Indicator */}
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white/60">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-10">
            {errors.submit && (
              <div className="bg-gray-50 border-l-4 border-gray-900 p-5 rounded-lg mb-8 flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="text-gray-900 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Registration Failed</h3>
                  <p className="text-gray-600 text-sm">{errors.submit}</p>
                </div>
              </div>
            )}

            <form className="space-y-10" onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <User size={20} className="text-gray-400" />
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-5">
                  <Input 
                    label="Full Name" 
                    name="patient_name" 
                    icon={User} 
                    value={formData.patient_name} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('patient_name')}
                    error={errors.patient_name}
                    isValid={isFieldValid('patient_name')}
                    placeholder="Enter patient's full name"
                  />

                  <div className="grid grid-cols-2 gap-5">
                    <Input 
                      label="Age" 
                      name="age" 
                      type="number" 
                      icon={Calendar} 
                      value={formData.age} 
                      onChange={handleChange}
                      onBlur={() => handleBlur('age')}
                      error={errors.age}
                      isValid={isFieldValid('age')}
                      placeholder="Age"
                      min="1"
                      max="120"
                    />

                    <Select 
                      label="Gender" 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange}
                      onBlur={() => handleBlur('gender')}
                      error={errors.gender}
                      isValid={isFieldValid('gender')}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Contact Information Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Mail size={20} className="text-gray-400" />
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                    Contact Details
                  </h3>
                </div>
                <div className="space-y-5">
                  <Input 
                    label="Email Address" 
                    name="email" 
                    type="email" 
                    icon={Mail} 
                    value={formData.email} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    error={errors.email}
                    isValid={isFieldValid('email')}
                    placeholder="patient@example.com"
                  />

                  <Input 
                    label="Phone Number" 
                    name="phone" 
                    icon={Phone} 
                    value={formData.phone} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    error={errors.phone}
                    isValid={isFieldValid('phone')}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Account Security Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Lock size={20} className="text-gray-400" />
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                    Account Security
                  </h3>
                </div>
                <div className="space-y-5">
                  <PasswordInput 
                    label="Temporary Password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    error={errors.password}
                    isValid={isFieldValid('password')}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                      <AlertCircle size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Patient will be prompted to change this password upon first login
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-lg font-medium text-base flex justify-center items-center gap-3 transition-all duration-200 ${
                    loading 
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99]"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <span>Registering Patient...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      <span>Register Patient</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            All patient information is encrypted and securely stored
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

const Input = ({ label, name, icon: Icon, error, isValid, onBlur, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        name={name}
        onBlur={onBlur}
        {...props}
        className={`w-full pl-12 pr-12 py-3.5 border rounded-lg transition-all duration-200 outline-none text-gray-900 ${
          error 
            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100" 
            : isValid
            ? "border-gray-900 bg-gray-50 focus:border-gray-900"
            : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        }`}
      />
      {isValid && (
        <CheckCircle2 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900" 
          size={18} 
        />
      )}
    </div>
    {error && (
      <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5">
        <AlertCircle size={14} />
        {error}
      </p>
    )}
  </div>
);

const PasswordInput = ({ label, name, error, isValid, onBlur, showPassword, setShowPassword, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        name={name}
        type={showPassword ? "text" : "password"}
        onBlur={onBlur}
        placeholder="Enter temporary password"
        {...props}
        className={`w-full pl-12 pr-12 py-3.5 border rounded-lg transition-all duration-200 outline-none text-gray-900 ${
          error 
            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100" 
            : isValid
            ? "border-gray-900 bg-gray-50 focus:border-gray-900"
            : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        }`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {error && (
      <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5">
        <AlertCircle size={14} />
        {error}
      </p>
    )}
  </div>
);

const Select = ({ label, name, value, onChange, onBlur, error, isValid }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3.5 border rounded-lg appearance-none cursor-pointer transition-all duration-200 outline-none text-gray-900 ${
          error 
            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100" 
            : isValid
            ? "border-gray-900 bg-gray-50 focus:border-gray-900"
            : "border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        }`}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      {isValid && (
        <CheckCircle2 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" 
          size={18} 
        />
      )}
    </div>
    {error && (
      <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5">
        <AlertCircle size={14} />
        {error}
      </p>
    )}
  </div>
);

export default PatientRegistration;