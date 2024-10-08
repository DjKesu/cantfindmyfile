import React, { useState } from "react";
import { FolderTree, Search, Tags, Clock, Eye } from "lucide-react";
import axios from "axios";
import Airtable from "airtable";

const LandingPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState("");
	const [selectedOptions, setSelectedOptions] = useState([]);

	const options = [
		{
			value: "Psychic Search?",
			label: "Psychic Search",
		},
		{ value: "Sherlock Search?", label: "Sherlock Search" },
		{ value: "Tag?", label: "Tag, You're It!" },
		{ value: "Intelligent Folder Whisperer?", label: "Intelligent Folder Whisperer" },
    { value: "Recently Files?", label: "Recent Files" },
    { value: "Other", label: "Other" },
	];

	const toggleOption = (value) => {
		setSelectedOptions((prevSelected) =>
			prevSelected.includes(value)
				? prevSelected.filter((option) => option !== value)
				: [...prevSelected, value]
		);
	};

	const handleSelectChange = (e) => {
		const options = Array.from(
			e.target.selectedOptions,
			(option) => option.value
		);
		setSelectedOptions(options);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		let data = {
			records: [
				{
					fields: {
						"User Email": email,
						"Feature Interest": selectedOptions,
					},
				},
			],
		};

		console.log("Data being sent to Airtable:", JSON.stringify(data, null, 2));
		let config = {
			method: "post",
			maxBodyLength: 1000,
			url: `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${
				import.meta.env.VITE_TABLE_ID
			}`,
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
		} catch (error) {
			console.error("Error submitting to Airtable:", error);
			setSubmitMessage("Oops! Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 text-white">
			<header className="container mx-auto py-8">
				<h1 className="text-4xl font-bold mb-2">cantfindmyfile.com</h1>
				<p className="text-xl">
					Where 'needle in a haystack' becomes 'file in a flash'
				</p>
			</header>

			<main className="container mx-auto py-12">
				<section className="mb-16">
					<h2 className="text-3xl font-semibold mb-6">
						File management that actually manages to impress
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<FeatureCard
							icon={<FolderTree className="w-12 h-12" />}
							title="Intelligent Folder Whisperer"
							description="Our AI suggests folder structures so logical, even your grandma could find your files."
						/>
						<FeatureCard
							icon={<Search className="w-12 h-12" />}
							title="Sherlock Search"
							description="Finds your files faster than you can say 'elementary, my dear Watson', using content and metadata."
						/>
						<FeatureCard
							icon={<Tags className="w-12 h-12" />}
							title="Tag, You're It!"
							description="Add tags to your heart's content. It's like hide and seek, but you always win."
						/>
						<FeatureCard
							icon={<Clock className="w-12 h-12" />}
							title="Time Machine (sort of)"
							description="Tracks your recently used files. Because we know you'll forget where you put them."
						/>
						<FeatureCard
							icon={<Eye className="w-12 h-12" />}
							title="X-Ray Vision"
							description="Preview files without opening them. It's not mind-reading, but it's close."
						/>
					</div>
				</section>

				<section className="text-center mb-16">
					<h2 className="text-3xl font-semibold mb-6">Why you'll love us</h2>
					<ul className="text-lg space-y-4">
						<li>✨ Organize files faster than a caffeinated librarian</li>
						<li>
							🔍 Find any file in seconds, even if you named it "asdfghjkl"
						</li>
						<li>⏱️ Access recent files quicker than your coffee gets cold</li>
						<li>🖼️ Preview files without opening 17 different apps</li>
					</ul>
				</section>

				<section className="text-center">
					<h2 className="text-3xl font-semibold mb-6">
						Ready to turn file chaos into file zen?
					</h2>
					{!showForm ? (
						<button
							onClick={() => setShowForm(true)}
							className="bg-white text-teal-600 font-bold py-3 px-6 rounded-full text-lg hover:bg-teal-100 transition duration-300"
						>
							Join the Waitlist
						</button>
					) : (
						<form
							onSubmit={handleSubmit}
							className="max-w-md mx-auto space-y-6"
						>
							<div className="flex items-center border-b border-white py-2">
								<input
									className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
									type="email"
									placeholder="Enter your email"
									aria-label="Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div>
								<p className="text-lg mb-4">
									Which features are you interested in?
								</p>
								<div className="flex flex-wrap justify-center">
									{options.map((option) => (
										<button
											key={option.value}
											type="button"
											onClick={() => toggleOption(option.value)}
											className={`m-2 px-4 py-2 rounded-full border ${
												selectedOptions.includes(option.value)
													? "bg-white text-teal-600 border-white"
													: "bg-transparent text-white border-white"
											} hover:bg-teal-100 hover:text-teal-600 transition duration-300`}
										>
											{option.label}
										</button>
									))}
								</div>
							</div>
							<button
								className="w-full bg-white text-teal-600 font-bold py-3 px-6 rounded-full hover:bg-teal-100 transition duration-300"
								type="submit"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Signing up..." : "Sign Up"}
							</button>
						</form>
					)}
					{submitMessage && <p className="mt-4 text-lg">{submitMessage}</p>}
				</section>
			</main>

			<footer className="container mx-auto py-8 text-center">
				<p>
					&copy; 2024 cantfindmyfile.com. If you can read this, congratulations!
					You've successfully located our copyright notice.
				</p>
			</footer>
		</div>
	);
};

const FeatureCard = ({ icon, title, description }) => {
	return (
		<div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
			<div className="flex items-center mb-4">
				{icon}
				<h3 className="text-xl font-semibold ml-4">{title}</h3>
			</div>
			<p>{description}</p>
		</div>
	);
};

export default LandingPage;
