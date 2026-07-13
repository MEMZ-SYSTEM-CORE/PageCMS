<script lang="ts">
  import { type WithoutChildrenOrChild, cn } from "$lib/utils.js";

  type Props = WithoutChildrenOrChild<HTMLAttributes<HTMLSpanElement>>;

  let { ref = $bindable(null), class: className, children, ...rest }: Props = $props();
</script>

<span ref={ref} role="link" aria-disabled="true" aria-current="page" class={cn("font-normal text-foreground", className)} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</span>
