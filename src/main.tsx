import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installErrorReporter } from "./lib/errorReporter";
import { captureUtmFromUrl, initClickTracking } from "./lib/eventTracker";

installErrorReporter();
captureUtmFromUrl();
initClickTracking();

createRoot(document.getElementById("root")!).render(<App />);
