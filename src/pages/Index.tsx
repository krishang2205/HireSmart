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
		<>
			<SeoHead title={title} description={description} jsonLd={jsonLd} />
			<Header />
			<main>
				<Hero />
				<Features />
				<HowItWorks />
				<Results />
				<Testimonials />
				<CTA />
			</main>
			<Footer />
		</>
	);
};

export default Index;
