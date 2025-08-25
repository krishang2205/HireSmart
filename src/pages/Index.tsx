import SeoHead from "@/components/SeoHead";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Results from "@/components/sections/Results";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NextSteps from './NextSteps';
import SeoHead from "@/components/SeoHead";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Results from "@/components/sections/Results";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
	const title = "HireSmart – AI-Powered Resume Screening";
	const description = "Evaluate resumes in seconds. Match skills. Hire smarter.";
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "HireSmart",
		description,
		applicationCategory: "BusinessApplication",
		operatingSystem: "Web",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD"
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col text-xs">
			<SeoHead title={title} description={description} jsonLd={jsonLd} />
			<Header />
			<main className="flex-1 flex flex-col px-4 py-4 gap-4 relative text-xs">
				<Hero />
				<Features />
				<HowItWorks />
				<Results />
				<Testimonials />
				<CTA />
				<Route path="/next-steps" element={<NextSteps />} />
			</main>
			<Footer />
		</div>
	);
};

export default Index;
