import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";
import "./index.css";

// Register the service worker so the app is installable and can work offline.
registerSW({
  immediate: true,
  onRegistered() {
    // no-op
  },
  onRegisterError(error) {
    console.error("SW registration error:", error);
  },
});

createRoot(document.getElementById("root")).render(<App />);
