import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // ✅ Tailwind stays
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PayPalScriptProvider
      options={{
        "client-id": "AUPzgjcQahbuvvLEDV0KTG8y139-G8ypuFczFVaUBB-YqpgSQK2U3DFtpODNNqLVH56NrKVHA7hzwCrl",
        currency: "USD"
      }}
    >
      <App />
    </PayPalScriptProvider>
  </React.StrictMode>
);
