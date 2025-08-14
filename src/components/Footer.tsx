import { Linkedin, Twitter, Mail } from "lucide-react";

const Footer = () => {
	return (
		<footer className="border-t border-border bg-muted/40">
			<div className="container mx-auto px-4 md:px-8 py-2">
				<div className="flex flex-row items-center justify-between w-full">
					{/* Left: Copyright */}
					<div className="flex-shrink-0 text-xs text-muted-foreground pl-2">
						© {new Date().getFullYear()} HireSmart. All rights reserved.
					</div>
					{/* Center: Links */}
					<nav aria-label="Footer links" className="flex gap-6 text-sm justify-center flex-1">
						<a href="#" className="story-link">About</a>
						<a href="#" className="story-link">Contact</a>
						<a href="#" className="story-link">Privacy Policy</a>
						<a href="#" className="story-link">Terms</a>
					</nav>
					{/* Right: Icons */}
					<div className="flex items-center gap-3 text-muted-foreground pr-2">
						<a href="#" aria-label="LinkedIn" className="hover-scale"><Linkedin /></a>
						<a href="#" aria-label="Twitter" className="hover-scale"><Twitter /></a>
						<a href="mailto:hello@hiresmart.app" aria-label="Email" className="hover-scale"><Mail /></a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
