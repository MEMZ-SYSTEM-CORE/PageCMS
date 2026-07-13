/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Platform {
		env?: {
			GITHUB_TOKEN?: string;
		};
	}
}
