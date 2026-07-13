<script lang="ts">
  import { type WithoutChildrenOrChild, cn } from "$lib/utils.js";

  type Props = WithoutChildrenOrChild<HTMLAttributes<HTMLElement>>;

  let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<nav ref={ref} aria-label="breadcrumb" class={cn("", className)} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</nav>
