<script lang="ts">
	import { ArrowRight, BookOpen } from '@lucide/svelte';

	let { postCount = 0, pageCount = 0 }: { postCount?: number; pageCount?: number } = $props();
</script>

<section class="pb-20 pt-16 sm:pb-28 sm:pt-20">
	<div class="animate-fade-up space-y-6">
		<div class="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-medium text-muted-foreground">
			<span class="inline-block size-1.5 rounded-full bg-foreground" />
			{postCount} 篇文章 · {pageCount} 个页面
		</div>

		<h1 class="max-w-3xl text-4xl font-bold tracking-tight leading-[1.1] sm:text-5xl lg:text-6xl">
			MEMZ-SYSTEM-CORE<br />
			<span class="text-muted-foreground">的博客</span>
		</h1>

		<p class="text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-base">
			基于 Astro + PagesCMS 构建的黑白风格静态站点。
			记录技术、分享知识、保持简洁。
		</p>
	</div>

	<div class="animate-fade-up-1 mt-8 flex flex-wrap items-center gap-3">
		<a href={postCount > 0 ? '#posts' : 'https://app.pagescms.org'}>
			<button class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
				{postCount > 0 ? '浏览文章' : '开始编辑'}
				<ArrowRight class="!size-4" />
			</button>
		</a>
		<a href="/about">
			<button class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
				<BookOpen class="!size-4" /> 关于
			</button>
		</a>
		<a href="https://space.bilibili.com/3494379408853453" target="_blank">
			<button class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
				<svg viewBox="0 0 24 24" fill="currentColor" class="!size-[17px]"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.92.453.267.302.4.622.4.96 0 .338-.133.658-.4.96l-1.147 1.12v-.16zm-8.546 5.707a.7.7 0 0 0-.693.693v4.267c0 .373.32.693.693.693.373 0 .693-.32.693-.693v-4.267a.7.7 0 0 0-.693-.693zm5.333 0a.7.7 0 0 0-.693.693v4.267c0 .373.32.693.693.693.373 0 .693-.32.693-.693v-4.267a.7.7 0 0 0-.693-.693z"/></svg>
				B站
			</button>
		</a>
	</div>
</section>
