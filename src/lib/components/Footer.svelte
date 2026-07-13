<script lang="ts">
  import { siteConfig } from '$lib/config/site';
</script>

<footer class="mt-16 border-t pt-6 pb-8">
  <div class="mx-auto max-w-5xl flex flex-col items-center gap-2 text-sm text-muted-foreground px-4">
    <p>&copy; {new Date().getFullYear()} {siteConfig.bio.name}</p>
    <p>{siteConfig.description}</p>
  </div>
</footer>
