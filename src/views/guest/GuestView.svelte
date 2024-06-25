<script lang="ts">
  import { link } from 'svelte-spa-router';
</script>

<div class="flex justify-center h-screen items-center">
  <div class="flex flex-col gap-6 items-center justify-center">
    <h3 class="text-9xl text-emerald-500 font-bold font-irish-grover">Triva</h3>
    <div class="grid grid-cols-2 w-[400px] h-[70px] gap-4">
      <a
        href="/host"
        use:link
        class="hover:border-b-[4px] border-b-[8px] border border-amber-700 bg-gradient-to-br from-amber-400 to-amber-600 select-none cursor-pointer text-3xl font-bold rounded-full flex justify-center items-center"
        >
        <span>Host</span>
      </a>
      <a
        href="/player"
        use:link
        class="hover:border-b-[4px] border-b-[8px] border border-sky-700 bg-gradient-to-br from-sky-400 to-sky-600 select-none cursor-pointer text-3xl font-bold rounded-full flex justify-center items-center"
        >
        <span>Join</span>
      </a>
    </div>
  </div>
</div>