<script lang="ts">
import ThiingsIcons from "./examples/ThiingsIcons.svelte";
import SimpleNumbers from "./examples/SimpleNumbers.svelte";
import ColorfulGrid from "./examples/ColorfulGrid.svelte";
import EmojiFun from "./examples/EmojiFun.svelte";
import CardLayout from "./examples/CardLayout.svelte";

type Props = {
  currentExample: number;
};

let { currentExample }: Props = $props();

const exampleComponents = [
  ThiingsIcons,
  SimpleNumbers,
  EmojiFun,
  ColorfulGrid,
  CardLayout,
];

const ExampleComponent = $derived(exampleComponents[currentExample]);
</script>

<div class="flex-1 relative w-full h-full overscroll-none">
  <ExampleComponent />
</div>