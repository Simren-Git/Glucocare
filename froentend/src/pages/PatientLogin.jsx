import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Activity,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

function PatientLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (role === "patient" && userId) {
      navigate("/patient-dashboard", { replace: true });
    }
  }, [role, userId, navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 characters required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }

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

      if (response.data.status === "success") {
        const { user_id, role } = response.data;

        // store login info
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("role", role);

        if (role === "patient") {
          navigate("/patient-dashboard");
        } else {
          setErrors({
            password: "This is not a patient account"
          });
        }
      }

    } catch (error) {
      const serverError = error.response?.data?.error;
      const message = serverError || (error.message === "Network Error"
        ? "Cannot reach server. Is the backend running?"
        : "Invalid email or password");
      setErrors({ password: message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-30 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30 -ml-48 -mb-48"></div>

      {/* Back button */}
      <button
        onClick={() => handleNavigation('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-teal-600 z-10"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </button>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT SIDE – WELCOME CARD */}
          <div className="hidden md:block">
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-400 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="text-white" size={32} />
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome Back!
              </h2>

              <p className="text-lg text-gray-600 mb-8">
                Access your personal health dashboard and continue your journey
                to better diabetes management.
              </p>

              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-teal-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Track Your Progress</h4>
                    <p className="text-sm text-gray-600">
                      View your glucose trends and health insights
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                    <Heart className="text-green-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Connect with Your Doctor</h4>
                    <p className="text-sm text-gray-600">
                      Stay in touch with your healthcare team
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Personalized Care</h4>
                    <p className="text-sm text-gray-600">
                      Get tailored recommendations for your health
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE – LOGIN FORM */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-teal-500 to-green-400 p-2 rounded-xl">
                  <Heart className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-green-500 bg-clip-text text-transparent">
                  GlucoCare
                </span>
              </div>

              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full mb-4">
                <User size={16} />
                <span className="text-sm font-medium">Patient Portal</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
              <p className="text-gray-600">Continue your wellness journey</p>
            </div>

            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 py-3.5 border-2 rounded-2xl ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-2xl ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-2">{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition"
              >
                Sign In
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PatientLogin;
