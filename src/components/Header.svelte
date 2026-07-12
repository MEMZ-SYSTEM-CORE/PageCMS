<script lang="ts">
	import { Menu, X, ExternalLink } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import {
		Sheet,
		SheetTrigger,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetClose,
	} from '$lib/components/ui/sheet/index.js';
	import ThemeToggle from './ThemeToggle.svelte';

	let mobileOpen = $state(false);

	const navLinks = [
		{ href: '/', label: '首页' },
		{ href: '/about', label: '关于' },
	];

	function closeMobile() {
		mobileOpen = false;
	}
</script>

<header
	class="bg-background/80 border-border/40 supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-lg"
>
	<div class="mx-auto flex h-14 max-w-5xl items-center gap-2 px-4 sm:px-6">
		<!-- Logo -->
		<a href="/" class="font-heading text-foreground mr-4 text-lg font-semibold tracking-tight">
			<span class="text-primary">✦</span> PageCMS
		</a>

		<!-- Desktop nav -->
		<nav class="hidden items-center gap-0.5 sm:flex">
			{#each navLinks as link}
				<a href={link.href}>
					<Button variant="ghost" size="sm">{link.label}</Button>
				</a>
			{/each}
		</nav>

		<!-- Spacer -->
		<div class="flex-1" />

		<!-- Actions -->
		<div class="flex items-center gap-1">
			<ThemeToggle />

			<a
				href="https://pagescms.org"
				target="_blank"
				class="hidden sm:inline-flex"
			>
				<Button variant="outline" size="sm">
					PagesCMS
					<ExternalLink class="!size-3" />
				</Button>
			</a>

			<!-- Mobile menu trigger -->
			<div class="sm:hidden">
				<Sheet bind:open={mobileOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon-sm" aria-label="打开菜单">
							<Menu class="!size-4" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" class="w-64">
						<SheetHeader class="mb-4">
							<SheetTitle class="font-heading text-left text-lg tracking-tight">
								<span class="text-primary">✦</span> PageCMS
							</SheetTitle>
						</SheetHeader>

						<div class="flex flex-col gap-0.5">
							{#each navLinks as link}
								<a
									href={link.href}
									class="hover:bg-muted rounded-md px-3 py-2 text-sm font-medium transition-colors"
									{...{ onclick: closeMobile }}
								>
									{link.label}
								</a>
							{/each}
						</div>

						<Separator class="my-4" />

						<a
							href="https://pagescms.org"
							target="_blank"
							class="hover:bg-muted flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
						>
							PagesCMS
							<ExternalLink class="!size-3.5" />
						</a>

						<div class="absolute bottom-6 left-6 right-6">
							<SheetClose asChild>
								<Button variant="ghost" size="sm" class="w-full justify-start gap-2">
									<X class="!size-4" />
									关闭
								</Button>
							</SheetClose>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</div>
</header>
