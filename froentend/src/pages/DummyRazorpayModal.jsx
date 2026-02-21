import React, { useState, useEffect } from "react";
import { CreditCard, Smartphone, Building2, X, CheckCircle, Loader } from "lucide-react";

export default function DummyRazorpayModal({ amount, onSuccess, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsOpen(true), 10);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess("RZP_DUMMY_" + Date.now());
      }, 1500);
    }, 2000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`bg-white w-[420px] rounded-2xl p-8 shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scaleIn">
              <CheckCircle className="text-green-600 animate-checkmark" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-1">₹{amount.toFixed(2)} paid successfully</p>
            <p className="text-sm text-gray-500">Transaction ID: RZP_DUMMY_{Date.now()}</p>
          </div>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`bg-white w-[420px] rounded-2xl p-8 shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="text-blue-600 animate-spin" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment...</h3>
            <p className="text-gray-600">Please wait while we process your transaction</p>
            <div className="mt-6 flex justify-center gap-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white w-full max-w-[480px] rounded-2xl shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Razorpay</h2>
              <p className="text-xs text-blue-100">Secure Payment Gateway</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Amount Section */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-gray-900">₹{amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Healthcare Service</p>
              <p className="text-xs text-green-600 font-semibold">● Secure</p>
            </div>
          </div>
        </div>

        {/* Payment Methods Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("upi")}
              className={`flex-1 py-4 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "upi"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Smartphone size={18} />
              UPI
            </button>
            <button
              onClick={() => setActiveTab("card")}
              className={`flex-1 py-4 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "card"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <CreditCard size={18} />
              Card
            </button>
            <button
              onClick={() => setActiveTab("netbanking")}
              className={`flex-1 py-4 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "netbanking"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Building2 size={18} />
              Net Banking
            </button>
          </div>
        </div>

        {/* Payment Form */}
        <div className="p-6">
          {activeTab === "upi" && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                <input
                  type="text"
                  placeholder="example@paytm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Popular UPI Apps:</strong> PhonePe, Google Pay, Paytm, BHIM
                </p>
              </div>
            </div>
          )}

          {activeTab === "card" && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "netbanking" && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Bank</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option>Select Bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Pay ₹{amount.toFixed(2)}
          </button>

          <button
            onClick={handleClose}
            className="w-full mt-3 text-gray-600 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel Payment
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secured by Razorpay • PCI DSS Compliant</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes checkmark {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }

        .animate-checkmark {
          animation: checkmark 0.5s ease-out 0.3s;
        }
      `}</style>
    </div>
  );
}