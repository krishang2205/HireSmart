import { Linkedin, Twitter, Mail } from "lucide-react";

const Footer = () => {
	return (
		<footer className="border-t border-indigo-100/50 bg-indigo-50/50 backdrop-blur-sm">
			<div className="container mx-auto px-4 md:px-8 py-6">
				<div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
					{/* Left: Copyright */}
					<div className="text-xs text-indigo-900/60 font-medium">
						© {new Date().getFullYear()} HireSmart. All rights reserved.
					</div>
					{/* Center: Links */}
					<nav aria-label="Footer links" className="flex gap-6 text-sm justify-center flex-1">
						<a href="#" className="text-indigo-800/70 hover:text-indigo-600 transition-colors">About</a>
						<a href="#" className="text-indigo-800/70 hover:text-indigo-600 transition-colors">Contact</a>
						<a href="#" className="text-indigo-800/70 hover:text-indigo-600 transition-colors">Privacy Policy</a>
						<a href="#" className="text-indigo-800/70 hover:text-indigo-600 transition-colors">Terms</a>
					</nav>
					{/* Right: Icons */}
					<div className="flex items-center gap-4 text-indigo-400">
						<a href="#" aria-label="LinkedIn" className="hover:text-indigo-600 transition-colors transform hover:scale-110"><Linkedin className="w-5 h-5" /></a>
						<a href="#" aria-label="Twitter" className="hover:text-indigo-600 transition-colors transform hover:scale-110"><Twitter className="w-5 h-5" /></a>
						<a href="mailto:hello@hiresmart.app" aria-label="Email" className="hover:text-indigo-600 transition-colors transform hover:scale-110"><Mail className="w-5 h-5" /></a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
