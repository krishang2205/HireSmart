import SeoHead from "@/components/SeoHead";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Results from "@/components/sections/Results";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Pricing from "@/components/sections/Pricing";
import dashboardPreview from "@/assets/dashboard-preview.png";

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
		<div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50 via-white to-blue-50 flex flex-col text-sm selection:bg-indigo-100">
			<SeoHead title={title} description={description} jsonLd={jsonLd} />
			<div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent z-0"></div>
			<Header />
			<main className="flex-1 flex flex-col px-4 pt-32 pb-4 gap-4 relative text-sm z-10 selection:bg-indigo-100 selection:text-indigo-900">
				<Hero />
				<Features />

				<section className="py-12 md:py-16">
					<div className="container mx-auto px-6 max-w-5xl">
						<div className="rounded-2xl border border-indigo-100 bg-white/40 p-2 backdrop-blur-sm shadow-2xl">
							<img
								src={dashboardPreview}
								alt="Dashboard Preview"
								className="w-full h-auto rounded-xl shadow-inner bg-indigo-50/50"
							/>
						</div>
					</div>
				</section>

				<HowItWorks />
				<Results />
				<Pricing />
				<Testimonials />
				<CTA />
			</main>
			<Footer />
		</div>
	);
};

export default Index;
