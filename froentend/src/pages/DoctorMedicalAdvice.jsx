import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Send, Clock, Circle, User, Search, ChevronLeft } from "lucide-react";

export default function DoctorMedicalAdvice() {
  const doctorUserId = Number(localStorage.getItem("user_id"));

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const messagesEndRef = useRef(null);

  /* AUTO SCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* LOAD PATIENT LIST */
  useEffect(() => {
    if (!doctorUserId) return;

    axios
      .get(
        `http://127.0.0.1:8000/api/doctor/medical-advice/patients/${doctorUserId}/`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(res => {
        setPatients(res.data);
        if (res.data.length) setSelectedPatient(res.data[0]);
      })
      .catch(err =>
        console.error("Doctor patient list error:", err)
      );
  }, [doctorUserId]);

  /* LOAD CHAT */
  useEffect(() => {
    if (!selectedPatient) return;

    axios
      .get(
        `http://127.0.0.1:8000/api/medical-advice/patient/${selectedPatient.patient_id}/`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(res => setMessages(res.data))
      .catch(err =>
        console.error("Chat load error:", err)
      );
  }, [selectedPatient]);

  /* SEND MESSAGE */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient) return;

    await axios.post(
      "http://127.0.0.1:8000/api/medical-advice/send/",
      {
        patient_id: selectedPatient.patient_id,
        doctor_user_id: doctorUserId,
        sender_role: "doctor",
        message: newMessage.trim()
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    setMessages(prev => [
      ...prev,
      {
        sender_role: "doctor",
        message: newMessage.trim(),
        created_at: new Date().toISOString()
      }
    ]);

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredPatients = patients.filter(p =>
    p.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* PATIENT LIST SIDEBAR */}
      <div 
        className={`${
          showSidebar ? 'w-96' : 'w-0'
        } transition-all duration-300 border-r bg-white shadow-sm overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-xl font-semibold text-white mb-3">Patient Messages</h2>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
        </div>

        {/* Patient List */}
        <div className="flex-1 overflow-y-auto">
          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <User size={48} className="mx-auto mb-2 opacity-50" />
              <p>No patients found</p>
            </div>
          ) : (
            filteredPatients.map(p => (
              <button
                key={p.patient_id}
                onClick={() => setSelectedPatient(p)}
                className={`w-full p-4 border-b text-left transition-all duration-200 ${
                  selectedPatient?.patient_id === p.patient_id
                    ? 'bg-blue-50 border-l-4 border-l-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {p.patient_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{p.patient_name}</div>
                      {p.unread && (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                          <Circle size={8} className="fill-current" />
                          New message
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-2 ml-13">
                  {p.last_message || "No messages yet"}
                </p>
                
                <div className="text-xs text-gray-400 flex items-center gap-1 ml-13">
                  <Clock size={12} />
                  {formatTime(p.last_message_time)}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedPatient ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b shadow-sm p-4 flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {selectedPatient.patient_name.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {selectedPatient.patient_name}
                </h3>
                <p className="text-sm text-gray-500">Patient ID: {selectedPatient.patient_id}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.sender_role === "doctor"
                        ? "justify-end"
                        : "justify-start"
                    } animate-fadeIn`}
                  >
                    <div className={`flex flex-col ${m.sender_role === "doctor" ? "items-end" : "items-start"} max-w-lg`}>
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                          m.sender_role === "doctor"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm"
                            : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{m.message}</p>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 px-2">
                        {new Date(m.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t shadow-lg p-4">
              <div className="flex gap-3 items-end max-w-5xl mx-auto">
                <textarea
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border border-gray-300 rounded-2xl p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Type your medical advice here..."
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-4 rounded-2xl transition-all duration-200 ${
                    newMessage.trim()
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Press Enter to send • Shift + Enter for new line
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <User size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a patient to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}