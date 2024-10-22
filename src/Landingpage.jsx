import React, { useState } from "react";
import { FolderTree, Search, Tags, Clock, Eye, MessageCircleCodeIcon } from "lucide-react";
import axios from "axios";
import features from "./features.json"; // Importing features.json
import ToggleSwitch from "./ToggleSwitch"; // Reusable ToggleSwitch component

const LandingPage = ({ developerMode, toggleDeveloperMode }) => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [otherFeature, setOtherFeature] = useState(""); // New state for 'Other' text
  const [showOtherField, setShowOtherField] = useState(false); // State to control visibility of 'Other' text field

  // Generate options from features.json
  const options = [
    ...features.map((feature) => ({
      value: feature.name,
      label: feature.name + "?",
    })),
    { value: "Other", label: "Other" },
  ];

  const toggleOption = (value) => {
    if (value === "Other") {
      setShowOtherField((prev) => !prev);
      if (!selectedOptions.includes("Other")) {
        setSelectedOptions([...selectedOptions, value]);
      } else {
        setSelectedOptions(selectedOptions.filter((option) => option !== value));
        setOtherFeature(""); // Clear the 'Other' text when deselected
      }
    } else {
      setSelectedOptions((prevSelected) =>
        prevSelected.includes(value)
          ? prevSelected.filter((option) => option !== value)
          : [...prevSelected, value]
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate 'Other' field if 'Other' is selected
    if (selectedOptions.includes("Other") && otherFeature.trim() === "") {
      setSubmitMessage("Please specify your feature interest.");
      setIsSubmitting(false);
      return;
    }

    // Prepare feature interest data
    let featureInterest = selectedOptions.filter((option) => option !== "Other");
    if (selectedOptions.includes("Other")) {
      featureInterest.push(otherFeature);
    }

    let data = {
      records: [
        {
          fields: {
            "User Email": email,
            "Feature Interest": featureInterest,
            "Other": otherFeature,
          },
        },
      ],
    };

    console.log("Data being sent to Airtable:", JSON.stringify(data, null, 2));

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
      setSubmitMessage("Thank you for joining our waitlist!");
      setEmail("");
      setSelectedOptions([]);
      setOtherFeature("");
      setShowOtherField(false);
    } catch (error) {
      if (error.response) {
        console.error("Error response from Airtable:", error.response.data);
        setSubmitMessage(error.response.data.error.message);
      } else {
        console.error("Error submitting to Airtable:", error.message);
        setSubmitMessage("Oops! Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-5">
        {/* Header is managed by App.jsx, no internal header here */}

        <header className="mb-6 text-center">
          <h1 className="text-2xl md:text-4xl font-semibold md:font-bold mb-1">Can't find your file?</h1>
          <p className="text-base md:text-lg">
            File management that actually manages to impress
          </p>
        </header>

        <main>
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                let icon;
                switch (feature.name) {
                  case "Intelligent Folder Whisperer":
                    icon = <FolderTree className="w-8 h-8 text-blue-500" />;
                    break;
                  case "Sherlock Search":
                    icon = <Search className="w-8 h-8 text-green-500" />;
                    break;
                  case "Chat with Your Files":
                    icon = <MessageCircleCodeIcon className="w-8 h-8 text-purple-500" />;
                    break;
                  case "Time Machine (sort of)":
                    icon = <Clock className="w-8 h-8 text-yellow-500" />;
                    break;
                  case "X-Ray Vision":
                    icon = <Eye className="w-8 h-8 text-red-500" />;
                    break;
                  default:
                    icon = <FolderTree className="w-8 h-8 text-gray-500" />;
                }
                return (
                  <FeatureCard
                    key={index}
                    icon={icon}
                    title={feature.name}
                    description={feature.description}
                  />
                );
              })}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
              Why you'll love us
            </h2>
            <ul className="text-center text-base md:text-lg space-y-4">
              <li>✨ Super-fast file organization</li>
              <li>🔍 Find any file in seconds</li>
              <li>💬 Chat with your files</li>
            </ul>
          </section>

          <section className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              Ready for file zen?
            </h2>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-full text-base md:text-lg hover:bg-blue-700 transition duration-300"
              >
                Join the Waitlist
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                <div>
                  <input
                    className="appearance-none bg-gray-100 border border-gray-300 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <p className="text-base md:text-lg mb-2">Interested features:</p>
                  <div className="flex flex-wrap justify-center">
                    {options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleOption(option.value)}
                        className={`m-1 px-3 py-1 rounded-full border text-sm ${selectedOptions.includes(option.value)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-transparent text-gray-700 border-gray-700"
                          } hover:bg-blue-100 hover:text-blue-600 transition duration-300`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {showOtherField && (
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Please specify"
                        value={otherFeature}
                        onChange={(e) => setOtherFeature(e.target.value)}
                        className="appearance-none bg-gray-100 border border-gray-300 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                        required
                      />
                    </div>
                  )}
                </div>
                <button
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-base md:text-lg hover:bg-blue-700 transition duration-300"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
              </form>
            )}
            {submitMessage && <p className="mt-6 text-base md:text-lg">{submitMessage}</p>}
          </section>
        </main>

        <footer className="fixed bottom-0 w-full bg-white shadow p-2 z-50 h-16 flex justify-between items-center">
          {/* Centered Text */}
          <p className="text-sm text-gray-600 ">
            2024 cantfindmyfile.com
          </p>

          {/* Toggle Switch on the Right */}
          <div className="absolute right-10 flex items-center space-x-2 p-2">
            <span className="text-sm text-gray-600">Dev Mode</span>
            <ToggleSwitch
              isOn={developerMode}
              handleToggle={toggleDeveloperMode}
            />
          </div>
        </footer>

      </div>
    </div>
  );
};

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

export default LandingPage;
