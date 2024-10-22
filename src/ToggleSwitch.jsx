// src/ToggleSwitch.jsx
import React from "react";

const ToggleSwitch = ({ isOn, handleToggle, label }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      {label && <span className="text-sm text-black font-mono">{label}</span>}
      <input
        type="checkbox"
        checked={isOn}
        onChange={handleToggle}
        className="sr-only"
      />
      <div
        className={`w-6 h-3 rounded-full relative transition-colors duration-300 ${
          isOn ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute w-3 h-2.5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isOn ? "translate-x-3 bg-blue-500" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;
