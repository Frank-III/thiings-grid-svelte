<script lang="ts">
import ThiingsGrid, { type ItemConfig } from "$lib/ThiingsGrid.svelte";
</script>

{#snippet colorfulCellSnippet(itemConfig: ItemConfig)}
  {@const colors = [
    "bg-red-300",
    "bg-green-300",
    "bg-blue-300",
    "bg-yellow-300",
    "bg-pink-300",
    "bg-cyan-300",
  ]}
  {@const colorClass = colors[itemConfig.gridIndex % colors.length]}
  <div
    class="absolute inset-0 flex items-center justify-center {colorClass} text-xs font-bold text-gray-800 shadow-sm"
  >
    {itemConfig.gridIndex}
  </div>
{/snippet}

<ThiingsGrid gridSize={100} renderItem={colorfulCellSnippet} />