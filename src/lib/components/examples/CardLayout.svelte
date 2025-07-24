<script lang="ts">
import ThiingsGrid, { type ItemConfig } from "$lib/ThiingsGrid.svelte";
</script>

{#snippet cardCellSnippet(itemConfig: ItemConfig)}
  <div
    class="absolute inset-1 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-2 text-xs text-gray-800 transition-shadow {itemConfig.isMoving ? 'shadow-xl' : 'shadow-md'}"
  >
    <div class="text-base font-bold mb-1">#{itemConfig.gridIndex}</div>
    <div class="text-[10px] text-gray-500">
      {itemConfig.position.x}, {itemConfig.position.y}
    </div>
  </div>
{/snippet}

<ThiingsGrid
  gridSize={150}
  renderItem={cardCellSnippet}
/>