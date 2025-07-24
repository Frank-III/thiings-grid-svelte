<script lang="ts">
import ThiingsGrid, { type ItemConfig } from "$lib/ThiingsGrid.svelte";
</script>

{#snippet simpleNumberCellSnippet(itemConfig: ItemConfig)}
  <div class="absolute inset-1 flex items-center justify-center bg-blue-50 border border-blue-500 rounded text-sm font-bold text-blue-800">
    {itemConfig.gridIndex}
  </div>
{/snippet}

<ThiingsGrid
  gridSize={80}
  renderItem={simpleNumberCellSnippet}
  initialPosition={{ x: 0, y: 0 }}
/>