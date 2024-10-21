// src/FeatureCard.jsx
import React from "react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg md:text-xl font-semibold ml-4">{title}</h3>
      </div>
      <p className="text-gray-700 text-sm md:text-base">{description}</p>
    </div>
  );
};

export default FeatureCard;
