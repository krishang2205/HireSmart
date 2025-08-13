import { useEffect } from "react";

type SeoHeadProps = {
	title: string;
	description: string;
	canonical?: string;
	jsonLd?: Record<string, any>;
};

const SeoHead = ({ title, description, canonical, jsonLd }: SeoHeadProps) => {
	useEffect(() => {
		document.title = title;

		const ensureMeta = (name: string, attr: "name" | "property" = "name") => {
			let el = document.querySelector(`meta[${attr}='${name}']`) as HTMLMetaElement | null;
			if (!el) {
				el = document.createElement("meta");
				el.setAttribute(attr, name);
				document.head.appendChild(el);
			}
			return el;
		};

		ensureMeta("description").setAttribute("content", description);
		ensureMeta("og:title", "property").setAttribute("content", title);
		ensureMeta("og:description", "property").setAttribute("content", description);

		// Canonical link
		const href = canonical || window.location.href;
		let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
		if (!link) {
			link = document.createElement("link");
			link.setAttribute("rel", "canonical");
			document.head.appendChild(link);
		}
		link.setAttribute("href", href);

		// JSON-LD structured data
		if (jsonLd) {
			let script = document.getElementById("jsonld-primary") as HTMLScriptElement | null;
			if (!script) {
				script = document.createElement("script");
				script.type = "application/ld+json";
				script.id = "jsonld-primary";
				document.head.appendChild(script);
			}
			script.text = JSON.stringify(jsonLd);
		}
	}, [title, description, canonical, jsonLd]);

	return null;
};

export default SeoHead;
