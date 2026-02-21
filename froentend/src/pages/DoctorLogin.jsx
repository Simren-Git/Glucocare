import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  Shield,
  ArrowLeft,
  Activity,
  Users,
  TrendingUp,
  Clock
} from "lucide-react";

function DoctorLogin() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (role === "doctor" && userId) {
      navigate("/doctor-dashboard", { replace: true });
    }
  }, [role, userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setErrorMessage("");
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    }
    if (!formData.password.trim()) {
      errs.password = "Password is required";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${API_BASE}/login/`,
        {
          email: formData.email.trim(),
          password: formData.password.trim()
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("role", response.data.role);

      if (response.data.role === "doctor") {
        navigate("/doctor-dashboard", { replace: true });
      } else {
        setErrorMessage("Access denied. Doctor credentials required.");
      }

    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Left Side - Branding & Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 relative overflow-hidden">
        
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-10 w-40 h-40 border-4 border-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 border-4 border-white opacity-10 rounded-lg rotate-45"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-lg p-3 rounded-2xl">
                <Heart className="text-white" size={36} />
              </div>
              <span className="text-3xl font-bold">DiabeteCare</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Healthcare Provider<br />Portal
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Manage patient care, track glucose levels, and provide personalized treatment plans all in one place.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl flex-shrink-0">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Patient Management</h3>
                <p className="text-blue-100 text-sm">Monitor and manage all your patients in one centralized dashboard</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl flex-shrink-0">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Real-time Monitoring</h3>
                <p className="text-blue-100 text-sm">Track glucose readings and receive alerts for critical values</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl flex-shrink-0">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Analytics & Insights</h3>
                <p className="text-blue-100 text-sm">Data-driven insights to optimize treatment outcomes</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white border-opacity-20">
            <div>
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-blue-100 text-sm">Doctors</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">10K+</div>
              <div className="text-blue-100 text-sm">Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">98%</div>
              <div className="text-blue-100 text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <div className="bg-gradient-to-br from-blue-500 to-teal-400 p-3 rounded-xl">
                <Heart className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                DiabeteCare
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, Doctor</h2>
            <p className="text-gray-600">Sign in to access your healthcare dashboard</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="doctor@hospital.com"
                  className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-4 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Stethoscope size={20} />
                  Sign In
                </span>
              )}
            </button>
          </form>

          {/* Security Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-600" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-blue-600" />
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>

          {/* Mobile Logo Footer */}
          <div className="mt-8 text-center lg:hidden">
            <p className="text-xs text-gray-500">
              © 2026 DiabeteCare. Healthcare Provider Portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;