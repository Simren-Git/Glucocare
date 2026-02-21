import React, { useState, useRef, useEffect } from "react";
import { Stethoscope, Send } from "lucide-react";
import axios from "axios";

export default function PatientMedicalAdvice() {
  const patientUserId = Number(localStorage.getItem("user_id"));

  if (!patientUserId) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Please login again to access medical advice.
      </div>
    );
  }

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* AUTO SCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* LOAD CHAT (✅ FIXED URL) */
  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/api/medical-advice/user/${patientUserId}/`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(res => setMessages(res.data))
      .catch(err =>
        console.error("Failed to load messages:", err)
      );
  }, [patientUserId]);

  /* SEND MESSAGE */
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/medical-advice/send/",
        {
          patient_user_id: patientUserId,
          sender_role: "patient",
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
          sender_role: "patient",
          message: newMessage.trim(),
          created_at: new Date().toISOString()
        }
      ]);

      setNewMessage("");
      inputRef.current?.focus();
    } catch (err) {
      console.error("Send failed:", err.response?.data || err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-blue-50">
      <div className="bg-white border-b px-6 py-4 flex gap-2">
        <Stethoscope className="text-teal-600" />
        <h1 className="font-bold">Medical Advice</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.sender_role === "patient"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-lg ${
                m.sender_role === "patient"
                  ? "bg-teal-600 text-white"
                  : "bg-white border"
              }`}
            >
              {m.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white p-4 flex gap-3">
        <textarea
          ref={inputRef}
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Ask your doctor..."
          className="flex-1 border rounded-lg p-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-teal-600 text-white px-4 rounded-lg"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
