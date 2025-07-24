<script lang="ts">
import ThiingsGrid, { type ItemConfig } from "$lib/ThiingsGrid.svelte";
</script>

{#snippet emojiCellSnippet(itemConfig: ItemConfig)}
  {@const emojis = ["🎨", "🚀", "🌟", "🎪", "🎭", "🎨", "🎸", "🎯", "🎲", "🎳"]}
  {@const emoji = emojis[itemConfig.gridIndex % emojis.length]}
  <div class="absolute inset-2 flex items-center justify-center bg-gradient-to-br from-gray-100 to-white border border-gray-300 rounded-full text-2xl shadow-md">
    {emoji}
  </div>
{/snippet}

<ThiingsGrid
  gridSize={120}
  renderItem={emojiCellSnippet}
  initialPosition={{ x: 0, y: 0 }}
/>