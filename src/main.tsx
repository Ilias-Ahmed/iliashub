import { StrictMode, lazy} from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { initEmailJS } from "./utils/emailjs";

// Initialize EmailJS
initEmailJS();

// Lazy load the main App component
const App = lazy(() => import("./App.tsx"));

// Mount the application with performance optimizations
createRoot(document.getElementById("root")!).render(
  // Only use StrictMode in development
  import.meta.env.DEV ?
    <StrictMode>
        <App />
    </StrictMode>
   :
      <App />

);
