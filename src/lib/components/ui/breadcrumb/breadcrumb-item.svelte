<script lang="ts">
  import { type WithoutChildrenOrChild, cn } from "$lib/utils.js";

  type Props = WithoutChildrenOrChild<HTMLLiAttributes> & {
    href?: string;
  };

  let { ref = $bindable(null), class: className, href, children, ...rest }: Props = $props();
</script>

<li ref={ref} class={cn("inline-flex items-center gap-1.5", className)} {...rest}>
  {#if href}
    <a href={href} class="transition-colors hover:text-foreground">{#if children}{@render children()}{/if}</a>
  {:else if children}
    {@render children()}
  {/if}
</li>
