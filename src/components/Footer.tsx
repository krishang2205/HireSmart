import { Linkedin, Twitter, Mail } from "lucide-react";

const Footer = () => {
	return (
		<footer className="border-t border-border bg-muted/40">
			<div className="container mx-auto px-6 md:px-8 py-10">
				<div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
					<div>
						<span className="font-display text-xl font-bold">HireSmart</span>
						<p className="mt-1 text-sm text-muted-foreground">AI-powered resume screening</p>
					</div>

					<nav aria-label="Footer links" className="flex gap-6 text-sm">
						<a href="#" className="story-link">About</a>
						<a href="#" className="story-link">Contact</a>
						<a href="#" className="story-link">Privacy Policy</a>
						<a href="#" className="story-link">Terms</a>
					</nav>

					<div className="flex items-center gap-3 text-muted-foreground">
						<a href="#" aria-label="LinkedIn" className="hover-scale"><Linkedin /></a>
						<a href="#" aria-label="Twitter" className="hover-scale"><Twitter /></a>
						<a href="mailto:hello@hiresmart.app" aria-label="Email" className="hover-scale"><Mail /></a>
					</div>
				</div>
				<p className="mt-6 text-xs text-muted-foreground">
					© {new Date().getFullYear()} HireSmart. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
