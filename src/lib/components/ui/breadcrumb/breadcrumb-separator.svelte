<script lang="ts">
  import { type WithoutChildrenOrChild, cn } from "$lib/utils.js";

  type Props = WithoutChildrenOrChild<HTMLAttributes<HTMLSpanElement>>;

  let { ref = $bindable(null), class: className, ...rest }: Props = $props();
</script>

<span ref={ref} role="presentation" aria-hidden="true" class={cn("[&>svg]:size-3.5", className)} {...rest}>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="m9 18 6-6-6-6"/></svg>
</span>
