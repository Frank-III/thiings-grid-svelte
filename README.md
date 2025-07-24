# ThiingsGrid

A high-performance, infinite scrolling grid component for **Svelte 5** that provides smooth touch/mouse interactions with momentum-based scrolling. Perfect for displaying large datasets in a grid format with custom cell renderers.

🪩 **Explore Thiings.co** → [thiings.co](https://thiings.co)  
This is the component that powers the interactive grid on thiings.co - A growing collection of 1200+ free 3D icons, generated with AI.

🎮 **Try the Live Demo** → `npm run dev`  
Experience ThiingsGrid in action with interactive examples and copy-paste ready code.

## ✨ Features

- 🚀 **High Performance**: Only renders visible cells with optimized viewport calculations
- 📱 **Touch & Mouse Support**: Smooth interactions on both desktop and mobile
- 🎯 **Momentum Scrolling**: Natural physics-based scrolling with inertia
- ♾️ **Infinite Grid**: Supports unlimited grid sizes with efficient rendering
- 🎨 **Custom Renderers**: Flexible cell rendering with Svelte 5 snippets
- 🔧 **TypeScript Support**: Full type safety with comprehensive TypeScript definitions
- ⚡ **Svelte 5 Runes**: Built with modern Svelte 5 reactivity system

## 🚀 Quick Start

### Installation

This component is currently part of this repository. To use it in your project:

1. Copy the `src/lib/ThiingsGrid.svelte` file to your project
2. Install the required dependencies:

```bash
npm install svelte@^5.0.0
```

### Basic Usage

```svelte
<script lang="ts">
  import ThiingsGrid, { type ItemConfig } from '$lib/ThiingsGrid.svelte';
</script>

{#snippet myCell(itemConfig: ItemConfig)}
  <div class="absolute inset-1 flex items-center justify-center">
    {itemConfig.gridIndex}
  </div>
{/snippet}

<div style="width: 100vw; height: 100vh;">
  <ThiingsGrid
    gridSize={80}
    renderItem={myCell}
  />
</div>
```

## 📚 API Reference

### ThiingsGrid Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `gridSize` | `number` | ✅ | - | Size of each grid cell in pixels |
| `renderItem` | `Snippet<[ItemConfig]>` | ✅ | - | Svelte 5 snippet to render each grid cell |
| `class` | `string` | ❌ | - | CSS class name for the container |
| `initialPosition` | `Position` | ❌ | `{ x: 0, y: 0 }` | Initial scroll position |

### ItemConfig

The `renderItem` snippet receives an `ItemConfig` object with:

| Property | Type | Description |
|----------|------|-------------|
| `gridIndex` | `number` | Unique index for the grid cell |
| `position` | `Position` | Grid coordinates `{ x: number, y: number }` |
| `isMoving` | `boolean` | Whether the grid is currently being moved/scrolled |

### Position

```typescript
type Position = {
  x: number;
  y: number;
};
```

## 🎨 Examples

### Simple Numbers

```svelte
<script lang="ts">
  import ThiingsGrid, { type ItemConfig } from "$lib/ThiingsGrid.svelte";
</script>

{#snippet simpleNumberCell(itemConfig: ItemConfig)}
  <div class="absolute inset-1 flex items-center justify-center bg-blue-50 border border-blue-500 rounded text-sm font-bold text-blue-800">
    {itemConfig.gridIndex}
  </div>
{/snippet}

<ThiingsGrid
  gridSize={80}
  renderItem={simpleNumberCell}
  initialPosition={{ x: 0, y: 0 }}
/>
```

### Colorful Grid

```svelte
<script lang="ts">
  import ThiingsGrid, { type ItemConfig } from "$lib/ThiingsGrid.svelte";
</script>

{#snippet colorfulCell(itemConfig: ItemConfig)}
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

<ThiingsGrid gridSize={100} renderItem={colorfulCell} />
```

### Interactive Cards

```svelte
<script lang="ts">
  import ThiingsGrid, { type ItemConfig } from "$lib/ThiingsGrid.svelte";
</script>

{#snippet cardCell(itemConfig: ItemConfig)}
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
  renderItem={cardCell}
/>
```

## 🎯 Best Practices

### Cell Positioning
Always use absolute positioning within your snippet components for optimal performance:

```svelte
<!-- ✅ Good -->
{#snippet myCell(itemConfig: ItemConfig)}
  <div class="absolute inset-1 ...">
    {itemConfig.gridIndex}
  </div>
{/snippet}

<!-- ❌ Avoid - can cause layout issues -->
{#snippet myCell(itemConfig: ItemConfig)}
  <div class="w-full h-full ...">
    {itemConfig.gridIndex}
  </div>
{/snippet}
```

### Performance Optimization
For better performance with complex cells, use Svelte 5's reactive patterns:

```svelte
{#snippet optimizedCell(itemConfig: ItemConfig)}
  {@const computedValue = expensiveCalculation(itemConfig.gridIndex)}
  <div class="absolute inset-1 ...">
    {computedValue}
  </div>
{/snippet}
```

### Container Setup
Ensure the ThiingsGrid has a defined container size:

```svelte
<!-- ✅ Good - explicit container size -->
<div style="width: 100vw; height: 100vh;">
  <ThiingsGrid gridSize={80} renderItem={myCell} />
</div>

<!-- ✅ Good - CSS classes with defined dimensions -->
<div class="w-screen h-screen">
  <ThiingsGrid gridSize={80} renderItem={myCell} />
</div>
```

## 🔧 Advanced Usage

### Accessing Grid Position
You can access the current grid position programmatically:

```svelte
<script lang="ts">
  import ThiingsGrid from "$lib/ThiingsGrid.svelte";
  
  let gridComponent: ThiingsGrid;

  const getCurrentPosition = () => {
    if (gridComponent) {
      const position = gridComponent.getCurrentPosition();
      console.log('Current position:', position);
    }
  };
</script>

<ThiingsGrid
  bind:this={gridComponent}
  gridSize={80}
  renderItem={myCell}
/>
```

### Responsive Grid Sizes

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let gridSize = $state(80);

  onMount(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        gridSize = 60; // Smaller on mobile
      } else if (width < 1024) {
        gridSize = 80; // Medium on tablet
      } else {
        gridSize = 100; // Larger on desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
</script>

<ThiingsGrid
  gridSize={gridSize}
  renderItem={myCell}
/>
```

## 🎮 Interaction

### Touch/Mouse Events
The component handles:

- **Mouse**: Click and drag to pan
- **Touch**: Touch and drag to pan  
- **Wheel**: Scroll wheel for precise movements
- **Momentum**: Automatic momentum scrolling with physics

## 🔍 Development

### Running the Demo

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
src/
├── lib/
│   ├── ThiingsGrid.svelte      # Main component
│   └── components/
│       ├── examples/           # Example implementations
│       │   ├── SimpleNumbers.svelte
│       │   ├── ColorfulGrid.svelte
│       │   ├── EmojiFun.svelte
│       │   ├── CardLayout.svelte
│       │   └── ThiingsIcons.svelte
│       ├── Playground.svelte   # Example viewer
│       ├── SourceCode.svelte   # Source code display
│       ├── SourceCode.svelte.js # Source code data
│       └── Sidebar.svelte      # Example navigation
└── routes/
    └── +page.svelte           # Main demo application
```

## 🔄 Migrating from React

This Svelte version maintains API compatibility with the original React version:

### Key Changes:
- **Snippets** instead of render functions
- **Svelte 5 runes** (`$state`, `$derived`, `$effect`) instead of React hooks
- **`bind:this`** instead of `useRef`
- **Component props** using `$props()` rune

### Migration Example:

```jsx
// React version
const MyCell = ({ gridIndex, position, isMoving }) => (
  <div className="absolute inset-1">
    {gridIndex}
  </div>
);

<ThiingsGrid gridSize={80} renderItem={MyCell} />
```

```svelte
<!-- Svelte version -->
{#snippet myCell({ gridIndex, position, isMoving })}
  <div class="absolute inset-1">
    {gridIndex}
  </div>
{/snippet}

<ThiingsGrid gridSize={80} renderItem={myCell} />
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with **Svelte 5** and **TypeScript**
- Styled with **Tailwind CSS 4**
- Bundled with **SvelteKit** and **Vite**
- Original React version by [thiings.co](https://thiings.co)

## 🔗 Links

- **Demo**: Run `npm run dev` to see all examples
- **Original React Version**: [thiings-grid](https://github.com/charlieclark/thiings-grid)
- **Thiings.co**: [thiings.co](https://thiings.co) - Free 3D icons
- **Svelte 5**: [svelte.dev](https://svelte.dev)
