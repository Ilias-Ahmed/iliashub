import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { initEmailJS } from "./utils/emailjs";

// Initialize EmailJS once during bootstrap so it is ready before the app mounts
initEmailJS();

// Lazy load the main App component
const App = lazy(() => import("./App.tsx"));

// Mount the application with StrictMode enabled only during local development
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

const root = createRoot(rootElement);

root.render(
  import.meta.env.DEV ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  )
);
