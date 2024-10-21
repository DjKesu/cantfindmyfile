// src/RetroFileManagerLandingPage.jsx
import React, { useState, useEffect } from "react";
import { Folder, File, ChevronRight, Home, Menu, X } from "lucide-react";
import axios from "axios";
import features from "./features.json"; // Importing features.json

const RetroFileManagerLandingPage = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dynamically build the file system using features.json
  const fileSystem = {
    "README.txt": "Welcome to CantFindMyFile.com! [Join Waitlist]",
    "Features": features.reduce((acc, feature) => {
      acc[`${feature.name}.txt`] = feature.description;
      return acc;
    }, {}),
    "About Us": {
      "Why Choose Us.txt": "We provide exceptional file management solutions.",
      "Our Mission.txt": "To help you find your files quickly and efficiently.",
    },
  };

  const getCurrentFolder = () => {
    return currentPath.reduce((acc, folder) => acc[folder], fileSystem);
  };

  const handleItemClick = (item) => {
    const currentFolder = getCurrentFolder();
    if (currentFolder[item] && typeof currentFolder[item] === "object") {
      setCurrentPath([...currentPath, item]);
      setSelectedFile(null);
    } else {
      setSelectedFile(item);
    }
    if (isMobile) setIsMenuOpen(false);
  };

  const handleBackClick = () => {
    setCurrentPath(currentPath.slice(0, -1));
    setSelectedFile(null);
  };

  const handleHomeClick = () => {
    setCurrentPath([]);
    setSelectedFile(null);
    if (isMobile) setIsMenuOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare data for Airtable submission
    let data = {
      records: [
        {
          fields: {
            "User Email": email,
          },
        },
      ],
    };

    let config = {
      method: "post",
      maxBodyLength: 1000,
      url: `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_ID}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_BEARER_AUTH_AIRTABLE}`,
      },
      data: data,
    };

    try {
      await axios.request(config);
      setSubmitMessage("Thanks for joining our waitlist!");
      setEmail("");
      setIsSubmitting(false);
    } catch (error) {
      if (error.response) {
        console.error("Error response from Airtable:", error.response.data);
        setSubmitMessage(error.response.data.error.message);
      } else {
        console.error("Error submitting to Airtable:", error.message);
        setSubmitMessage("Oops! Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  const renderFileContent = () => {
    const currentFolder = getCurrentFolder();
    const content = selectedFile
      ? currentFolder[selectedFile]
      : fileSystem["README.txt"];

    // Check if content includes the Join Waitlist link
    if (
      (selectedFile === "README.txt" || (!selectedFile && currentPath.length === 0)) &&
      content.includes("[Join Waitlist]")
    ) {
      return (
        <div>
          <pre className="whitespace-pre-wrap">
            {content.replace("[Join Waitlist]", "")}
          </pre>
          <button
            onClick={() => setSelectedFile("JoinWaitlistForm")}
            className="mt-4 bg-blue-900 text-white px-4 py-2 rounded"
          >
            Join Waitlist
          </button>
        </div>
      );
    }

    if (selectedFile === "JoinWaitlistForm") {
      return (
        <div className="bg-gray-100 p-4 rounded text-black">
          <h2 className="text-lg font-bold mb-4">Join Our Waitlist</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">
                Enter your email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2 py-1 border border-gray-400 rounded"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-900 text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </button>
          </form>
          {submitMessage && <p className="mt-4 text-green-700">{submitMessage}</p>}
        </div>
      );
    }

    return <pre className="whitespace-pre-wrap">{content}</pre>;
  };

  const renderDesktopView = () => (
    <div className="flex-grow flex">
      <div className="w-1/3 bg-gray-700 p-2 overflow-y-auto border-r border-gray-600 rounded">
        {currentPath.length > 0 && (
          <div
            className="flex items-center cursor-pointer hover:bg-gray-600 p-1 rounded"
            onClick={handleBackClick}
          >
            <ChevronRight size={18} className="mr-1 text-gray-300" />
            <span className="text-gray-300">..</span>
          </div>
        )}
        {Object.entries(getCurrentFolder()).map(([name, content]) => (
          <div
            key={name}
            className="flex items-center cursor-pointer hover:bg-gray-600 p-1 rounded"
            onClick={() => handleItemClick(name)}
          >
            {typeof content === "object" ? (
              <Folder size={18} className="mr-1 text-yellow-400" />
            ) : (
              <File size={18} className="mr-1 text-green-400" />
            )}
            <span className="text-gray-300">{name}</span>
          </div>
        ))}
      </div>

      <div className="w-2/3 bg-white text-black p-4 overflow-y-auto border-l border-gray-600 rounded">
        {renderFileContent()}
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div className="flex flex-col flex-grow">
      {/* Top Header */}
      <div className="bg-gray-900 p-2 mb-4 flex items-center justify-between rounded">
        <button onClick={handleHomeClick} aria-label="Go to Home">
          <Home size={18} className="text-white" />
        </button>
        <span className="truncate text-white">/home/user/{currentPath.join("/")}</span>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
          {isMenuOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
        </button>
      </div>

      {/* Side Menu for Mobile */}
      {isMenuOpen && (
        <div className="bg-gray-700 p-2 overflow-y-auto rounded shadow-inner mb-4">
          {currentPath.length > 0 && (
            <div
              className="flex items-center cursor-pointer hover:bg-gray-600 p-1 rounded"
              onClick={handleBackClick}
            >
              <ChevronRight size={18} className="mr-1 text-gray-300" />
              <span className="text-gray-300">..</span>
            </div>
          )}
          {Object.entries(getCurrentFolder()).map(([name, content]) => (
            <div
              key={name}
              className="flex items-center cursor-pointer hover:bg-gray-600 p-1 rounded"
              onClick={() => handleItemClick(name)}
            >
              {typeof content === "object" ? (
                <Folder size={18} className="mr-1 text-yellow-400" />
              ) : (
                <File size={18} className="mr-1 text-green-400" />
              )}
              <span className="text-gray-300">{name}</span>
            </div>
          ))}
        </div>
      )}

      {/* File Content */}
      <div className="bg-white text-black p-4 overflow-y-auto flex-grow rounded shadow-inner">
        {renderFileContent()}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-800 text-white p-4 font-mono flex flex-col">
      {/* Main Content */}
      <div className="flex-grow flex">
        {isMobile ? renderMobileView() : renderDesktopView()}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 p-4 text-center flex justify-center items-center flex-nowrap">
        <span className="text-sm text-white font-mono">
          2024 CantFindMyFile.com
        </span>
      </footer>
    </div>
  );
};

export default RetroFileManagerLandingPage;
