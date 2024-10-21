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
      {/* Fixed Header with Dev Mode Toggle */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow p-2 flex justify-end items-center z-50">
        <ToggleSwitch
          isOn={developerMode}
          handleToggle={toggleDeveloperMode}
          label="Dev Mode"
        />
      </header>

      {/* Main Content Area */}
      <main className="flex-grow mt-12"> {/* Adjusted top margin to avoid overlap with fixed header */}
        {developerMode ? (
          <RetroFileManagerLandingPage />
        ) : (
          <LandingPage />
        )}
      </main>
    </div>
  );
}

export default App;
