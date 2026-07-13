<script lang="ts">
  import { type WithoutChildrenOrChild, cn } from "$lib/utils.js";

  type Props = WithoutChildrenOrChild<HTMLAttributes<HTMLOListElement>>;

  let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<ol ref={ref} class={cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", className)} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</ol>
