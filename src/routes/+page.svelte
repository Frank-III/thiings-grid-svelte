<script lang="ts">
  import "../app.css";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Playground from "$lib/components/Playground.svelte";
  import SourceCode from "$lib/components/SourceCode.svelte";

  let currentExample = $state(0);

  const handleExampleChange = (index: number) => {
    currentExample = index;
  };
</script>

<div class="flex h-screen w-screen font-sans">
  <Sidebar {currentExample} onExampleChange={handleExampleChange} />
  <main class="flex flex-1 flex-col h-screen">
    <div class="flex-[3] relative bg-white border-b border-gray-200">
      <Playground {currentExample} />
    </div>
    <div class="flex flex-1 min-h-[300px]">
      <SourceCode {currentExample} />
    </div>
  </main>
</div>
