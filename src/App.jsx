// src/App.jsx
import React, { useState } from "react";
import LandingPage from "./Landingpage";
import RetroFileManagerLandingPage from "./RetroFileManagerLandingPage";
import ToggleSwitch from "./ToggleSwitch"; // Reusable ToggleSwitch component

function App() {
  const [developerMode, setDeveloperMode] = useState(false); // Dev Mode is off by default

  const toggleDeveloperMode = () => {
    setDeveloperMode((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col">

      <main className="flex-grow mt-12"> {/* Adjusted top margin to avoid overlap with fixed header */}
        {developerMode ? (
          <RetroFileManagerLandingPage handleToggle={toggleDeveloperMode} isOn={developerMode} />
        ) : (
          <LandingPage developerMode={developerMode} toggleDeveloperMode={toggleDeveloperMode}/>
        )}
      </main>
    </div>
  );
}

export default App;
