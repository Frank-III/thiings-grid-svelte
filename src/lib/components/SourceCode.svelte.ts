export const sourceCodes = [
  // ThiingsIcons.svelte
  `<script lang="ts">
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
/>`,

  // SimpleNumbers.svelte
  `<script lang="ts">
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
/>`,

  // EmojiFun.svelte
  `<script lang="ts">
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
/>`,

  // ColorfulGrid.svelte
  `<script lang="ts">
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

<ThiingsGrid gridSize={100} renderItem={colorfulCellSnippet} />`,

  // CardLayout.svelte
  `<script lang="ts">
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
/>`
];

export const componentNames = ["ThiingsIcons", "SimpleNumbers", "EmojiFun", "ColorfulGrid", "CardLayout"];