<script lang="ts">
  import { type WithoutChildrenOrChild, cn } from "$lib/utils.js";

  type Props = WithoutChildrenOrChild<HTMLAttributes<HTMLSpanElement>>;

  let { ref = $bindable(null), class: className, ...rest }: Props = $props();
</script>

<span ref={ref} role="presentation" aria-hidden="true" class={cn("flex size-9 items-center justify-center", className)} {...rest}>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
  <span class="sr-only">More</span>
</span>
