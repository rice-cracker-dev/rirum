<script lang="ts">
  import { enhance } from '$app/forms';

  let className = '';
  let loading = false;
  let method = 'post';

  export { className as class };
</script>

<form
  {method}
  class={className}
  use:enhance={() => {
    loading = true;

    return async ({ update }) => {
      loading = false;
      update();
    };
  }}
>
  <slot {loading} />
</form>
