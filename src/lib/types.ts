export interface Post {
	slug: string;
	title: string;
	pubDate: Date;
	description?: string;
	image?: string;
	tags?: string[];
	draft?: boolean;
	body: string;
}

export interface Page {
	slug: string;
	title: string;
	description?: string;
	body: string;
}

export interface Settings {
	siteName: string;
	tagline?: string;
	footerText?: string;
	ogImage?: string;
	seoDescription?: string;
}
