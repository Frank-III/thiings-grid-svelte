<script lang="ts">
  import { sourceCodes, componentNames } from "./SourceCode.svelte.js";

  type Props = {
    currentExample: number;
  };

  let { currentExample }: Props = $props();

  const currentComponentName = $derived(componentNames[currentExample]);
  const currentSourceCode = $derived(sourceCodes[currentExample]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSourceCode);
      console.log("Example code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const handleCopyThiingsGrid = async () => {
    try {
      // In a real implementation, you could fetch the actual ThiingsGrid source
      const fallbackCode =
        "// ThiingsGrid.svelte\n// The main grid component - view source at:\n// /src/lib/ThiingsGrid.svelte";
      await navigator.clipboard.writeText(fallbackCode);
      console.log("ThiingsGrid component copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy ThiingsGrid to clipboard:", err);
    }
  };
</script>

<section class="flex-[2] p-4 border-r border-gray-200 bg-gray-50 flex flex-col">
  <div class="mb-4">
    <h3 class="m-0 text-lg font-semibold">{currentComponentName}</h3>
  </div>

  <pre
    class="bg-gray-100 p-4 rounded-lg text-xs leading-relaxed overflow-auto flex-1 border border-gray-200 font-mono mb-4"><code
      >{currentSourceCode}</code
    ></pre>

  <div class="flex gap-3">
    <button
      onclick={handleCopy}
      class="flex-1 px-4 py-2.5 bg-blue-600 text-white border-none rounded-lg cursor-pointer text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
    >
      Copy Example
    </button>

    <button
      onclick={handleCopyThiingsGrid}
      class="flex-1 px-4 py-2.5 bg-gray-600 text-white border-none rounded-lg cursor-pointer text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
    >
      Copy ThiingsGrid.svelte
    </button>
  </div>
</section>
