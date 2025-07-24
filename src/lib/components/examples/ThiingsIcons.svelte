<script lang="ts">
import ThiingsGrid, { type ItemConfig } from "$lib/ThiingsGrid.svelte";
</script>

{#snippet thiingsIconCellSnippet(itemConfig: ItemConfig)}
  {@const images = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]}
  <div class="absolute inset-1 flex items-center justify-center">
    <img
      draggable={false}
      src="/thiings/{images[itemConfig.gridIndex % images.length]}.png"
      alt="Thiings icon {itemConfig.gridIndex}"
    />
  </div>
{/snippet}

<ThiingsGrid
  gridSize={160}
  renderItem={thiingsIconCellSnippet}
  initialPosition={{ x: 0, y: 0 }}
/>