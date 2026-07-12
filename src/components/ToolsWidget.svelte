<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { ExternalLink, Link2, MessageCircle, ScrollText } from '@lucide/svelte';

	const toolLinks = [
		{ label: '博客文章', href: '/', icon: 'post', desc: '查看所有文章' },
		{ label: '关于本站', href: '/about', icon: 'about', desc: '站点信息与统计' },
	];

	let { postCount = 0, tagCount = 0 }: { postCount?: number; tagCount?: number } = $props();
</script>

<Card class="ring-foreground/10 rounded-2xl ring-1 border-0 mb-4" size="sm">
	<CardHeader class="pb-3">
		<CardTitle class="text-xs font-medium text-muted-foreground tracking-wider uppercase flex items-center gap-2">
			<MessageCircle class="!size-3.5" />
			社交
		</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="flex flex-wrap gap-2">
			<a href="https://space.bilibili.com/3494379408853453" target="_blank" rel="noopener">
				<Button variant="secondary" size="sm" class="rounded-full gap-1.5 text-xs">
					<svg viewBox="0 0 24 24" fill="currentColor" class="!size-3.5"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.92.453.267.302.4.622.4.96 0 .338-.133.658-.4.96l-1.147 1.12v-.16zm-8.546 5.707a.7.7 0 0 0-.693.693v4.267c0 .373.32.693.693.693.373 0 .693-.32.693-.693v-4.267a.7.7 0 0 0-.693-.693zm5.333 0a.7.7 0 0 0-.693.693v4.267c0 .373.32.693.693.693.373 0 .693-.32.693-.693v-4.267a.7.7 0 0 0-.693-.693z"/></svg>
					B站主页
				</Button>
			</a>
			<a href="https://github.com/MEMZ-SYSTEM-CORE" target="_blank" rel="noopener">
				<Button variant="secondary" size="sm" class="rounded-full gap-1.5 text-xs">
					<svg viewBox="0 0 24 24" fill="currentColor" class="!size-3.5"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
					GitHub
				</Button>
			</a>
			<a href="/"><Button variant="secondary" size="sm" class="rounded-full gap-1.5 text-xs">博客</Button></a>
		</div>
	</CardContent>
</Card>

<div class="grid gap-4 sm:grid-cols-2">
	<Card class="ring-foreground/10 rounded-2xl ring-1 border-0" size="sm">
		<CardHeader class="pb-3">
			<CardTitle class="text-xs font-medium text-muted-foreground tracking-wider uppercase flex items-center gap-2">
				<Link2 class="!size-3.5" />
				导航
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-1.5">
			{#each toolLinks as link}
				<a
					href={link.href}
					class="ring-foreground/10 bg-card text-card-foreground flex items-center gap-3 rounded-xl ring-1 px-3.5 py-2.5 text-sm transition-all hover:shadow-sm no-underline group"
				>
					{#if link.icon === 'about'}
						<ScrollText class="!size-4 text-muted-foreground shrink-0" />
					{:else}
						<Link2 class="!size-4 text-muted-foreground shrink-0" />
					{/if}
					<div class="flex-1 min-w-0">
						<span class="font-medium group-hover:text-primary transition-colors">{link.label}</span>
						{#if link.desc}
							<span class="text-xs text-muted-foreground ml-2">{link.desc}</span>
						{/if}
					</div>
					<ExternalLink class="!size-3 text-muted-foreground/40 shrink-0" />
				</a>
			{/each}
		</CardContent>
	</Card>

	<Card class="ring-foreground/10 rounded-2xl ring-1 border-0" size="sm">
		<CardContent class="pt-5">
			<div class="text-center space-y-3">
				<div class="flex items-center justify-center gap-6">
					<div>
						<div class="text-2xl font-bold">{postCount}</div>
						<div class="text-xs text-muted-foreground">文章</div>
					</div>
					<div class="h-10 w-px bg-border/60" />
					<div>
						<div class="text-2xl font-bold">{tagCount}</div>
						<div class="text-xs text-muted-foreground">标签</div>
					</div>
				</div>
				<div class="text-xs text-muted-foreground/60">基于 Astro · PagesCMS 驱动</div>
			</div>
		</CardContent>
	</Card>
</div>
