<script lang="ts">
  // Grid physics constants
  const MIN_VELOCITY = 0.2;
  const UPDATE_INTERVAL = 16;
  const VELOCITY_HISTORY_SIZE = 5;
  const FRICTION = 0.9;
  const VELOCITY_THRESHOLD = 0.3;

  // Custom debounce implementation
  function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number,
  ) {
    let timeoutId: number | undefined = undefined;

    const debouncedFn = function (...args: Parameters<T>) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
        timeoutId = undefined;
      }, wait);
    };

    debouncedFn.cancel = function () {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    };

    return debouncedFn;
  }

  // Custom throttle implementation
  function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number,
    options: { leading?: boolean; trailing?: boolean } = {},
  ) {
    let lastCall = 0;
    let timeoutId: number | undefined = undefined;
    const { leading = true, trailing = true } = options;

    const throttledFn = function (...args: Parameters<T>) {
      const now = Date.now();

      if (!lastCall && !leading) {
        lastCall = now;
      }

      const remaining = limit - (now - lastCall);

      if (remaining <= 0 || remaining > limit) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
        lastCall = now;
        func(...args);
      } else if (!timeoutId && trailing) {
        timeoutId = setTimeout(() => {
          lastCall = leading ? Date.now() : 0;
          timeoutId = undefined;
          func(...args);
        }, remaining);
      }
    };

    throttledFn.cancel = function () {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };

    return throttledFn;
  }

  function getDistance(p1: Position, p2: Position) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  type Position = {
    x: number;
    y: number;
  };

  type GridItem = {
    position: Position;
    gridIndex: number;
  };

  export type ItemConfig = {
    isMoving: boolean;
    position: Position;
    gridIndex: number;
  };

  type Props = {
    gridSize: number;
    renderItem: (itemConfig: ItemConfig) => any;
    class?: string;
    initialPosition?: Position;
  };

  let {
    gridSize,
    renderItem,
    class: className,
    initialPosition,
  }: Props = $props();

  // State using Svelte 5 runes
  let containerElement: HTMLElement | undefined = $state();
  let offset = $state(
    initialPosition ? { ...initialPosition } : { x: 0, y: 0 },
  );
  let restPos = $state(
    initialPosition ? { ...initialPosition } : { x: 0, y: 0 },
  );
  let startPos = $state({ x: 0, y: 0 });
  let velocity = $state({ x: 0, y: 0 });
  let isDragging = $state(false);
  let gridItems = $state<GridItem[]>([]);
  let isMoving = $state(false);
  let lastMoveTime = $state(0);
  let velocityHistory = $state<Position[]>([]);

  // Private variables
  let lastPos = { x: 0, y: 0 };
  let animationFrame: number | null = null;
  let isComponentMounted = false;
  let lastUpdateTime = 0;

  const calculateVisiblePositions = (): Position[] => {
    if (!containerElement) return [];

    const rect = containerElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate grid cells needed to fill container
    const cellsX = Math.ceil(width / gridSize);
    const cellsY = Math.ceil(height / gridSize);

    // Calculate center position based on offset
    const centerX = -Math.round(offset.x / gridSize);
    const centerY = -Math.round(offset.y / gridSize);

    const positions: Position[] = [];
    const halfCellsX = Math.ceil(cellsX / 2);
    const halfCellsY = Math.ceil(cellsY / 2);

    for (let y = centerY - halfCellsY; y <= centerY + halfCellsY; y++) {
      for (let x = centerX - halfCellsX; x <= centerX + halfCellsX; x++) {
        positions.push({ x, y });
      }
    }

    return positions;
  };

  const getItemIndexForPosition = (x: number, y: number): number => {
    // Special case for center
    if (x === 0 && y === 0) return 0;

    // Determine which layer of the spiral we're in
    const layer = Math.max(Math.abs(x), Math.abs(y));

    // Calculate the size of all inner layers
    const innerLayersSize = Math.pow(2 * layer - 1, 2);

    // Calculate position within current layer
    let positionInLayer = 0;

    if (y === 0 && x === layer) {
      // Starting position (middle right)
      positionInLayer = 0;
    } else if (y < 0 && x === layer) {
      // Right side, bottom half
      positionInLayer = -y;
    } else if (y === -layer && x > -layer) {
      // Bottom side
      positionInLayer = layer + (layer - x);
    } else if (x === -layer && y < layer) {
      // Left side
      positionInLayer = 3 * layer + (layer + y);
    } else if (y === layer && x < layer) {
      // Top side
      positionInLayer = 5 * layer + (layer + x);
    } else {
      // Right side, top half (y > 0 && x === layer)
      positionInLayer = 7 * layer + (layer - y);
    }

    const index = innerLayersSize + positionInLayer;
    return index;
  };

  const debouncedStopMoving = debounce(() => {
    isMoving = false;
    restPos = { ...offset };
  }, 200);

  const updateGridItems = () => {
    if (!isComponentMounted) return;

    const positions = calculateVisiblePositions();
    const newItems = positions.map((position) => {
      const gridIndex = getItemIndexForPosition(position.x, position.y);
      return {
        position,
        gridIndex,
      };
    });

    const distanceFromRest = getDistance(offset, restPos);

    gridItems = newItems;
    isMoving = distanceFromRest > 5;

    debouncedStopMoving();
  };

  const debouncedUpdateGridItems = throttle(updateGridItems, UPDATE_INTERVAL, {
    leading: true,
    trailing: true,
  });

  const animate = () => {
    if (!isComponentMounted) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastUpdateTime;

    if (deltaTime >= UPDATE_INTERVAL) {
      const speed = Math.sqrt(
        velocity.x * velocity.x + velocity.y * velocity.y,
      );

      if (speed < MIN_VELOCITY) {
        velocity = { x: 0, y: 0 };
        return;
      }

      // Apply non-linear deceleration based on speed
      let deceleration = FRICTION;
      if (speed < VELOCITY_THRESHOLD) {
        // Apply stronger deceleration at lower speeds for more natural stopping
        deceleration = FRICTION * (speed / VELOCITY_THRESHOLD);
      }

      offset = {
        x: offset.x + velocity.x,
        y: offset.y + velocity.y,
      };
      velocity = {
        x: velocity.x * deceleration,
        y: velocity.y * deceleration,
      };

      debouncedUpdateGridItems();
      lastUpdateTime = currentTime;
    }

    animationFrame = requestAnimationFrame(animate);
  };

  const handleDown = (p: Position) => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    isDragging = true;
    startPos = {
      x: p.x - offset.x,
      y: p.y - offset.y,
    };
    velocity = { x: 0, y: 0 };

    lastPos = { x: p.x, y: p.y };
  };

  const handleMove = (p: Position) => {
    if (!isDragging) return;

    const currentTime = performance.now();
    const timeDelta = currentTime - lastMoveTime;

    // Calculate raw velocity based on position and time
    const rawVelocity = {
      x: (p.x - lastPos.x) / (timeDelta || 1),
      y: (p.y - lastPos.y) / (timeDelta || 1),
    };

    // Add to velocity history and maintain fixed size
    velocityHistory = [...velocityHistory, rawVelocity];
    if (velocityHistory.length > VELOCITY_HISTORY_SIZE) {
      velocityHistory = velocityHistory.slice(1);
    }

    // Calculate smoothed velocity using moving average
    const smoothedVelocity = velocityHistory.reduce(
      (acc, vel) => ({
        x: acc.x + vel.x / velocityHistory.length,
        y: acc.y + vel.y / velocityHistory.length,
      }),
      { x: 0, y: 0 },
    );

    velocity = smoothedVelocity;
    offset = {
      x: p.x - startPos.x,
      y: p.y - startPos.y,
    };
    lastMoveTime = currentTime;

    updateGridItems();
    lastPos = { x: p.x, y: p.y };
  };

  const handleUp = () => {
    isDragging = false;
    animationFrame = requestAnimationFrame(animate);
  };

  const handleMouseDown = (e: MouseEvent) => {
    handleDown({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    handleMove({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseUp = () => {
    handleUp();
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];

    if (!touch) return;

    handleDown({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];

    if (!touch) return;

    e.preventDefault();
    handleMove({
      x: touch.clientX,
      y: touch.clientY,
    });
  };

  const handleTouchEnd = () => {
    handleUp();
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    // Get the scroll deltas
    const deltaX = e.deltaX;
    const deltaY = e.deltaY;

    offset = {
      x: offset.x - deltaX,
      y: offset.y - deltaY,
    };
    velocity = { x: 0, y: 0 }; // Reset velocity when scrolling

    debouncedUpdateGridItems();
  };

  // Public method
  export const getCurrentPosition = () => {
    return offset;
  };

  // Lifecycle effects
  $effect(() => {
    isComponentMounted = true;
    updateGridItems();

    return () => {
      isComponentMounted = false;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      debouncedUpdateGridItems.cancel();
    };
  });

  $effect(() => {
    if (containerElement) {
      // Add non-passive event listeners
      containerElement.addEventListener("wheel", handleWheel, {
        passive: false,
      });
      containerElement.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });

      return () => {
        containerElement?.removeEventListener("wheel", handleWheel);
        containerElement?.removeEventListener("touchmove", handleTouchMove);
      };
    }
  });

  // Derived values
  const containerRect = $derived(containerElement?.getBoundingClientRect());
  const containerWidth = $derived(containerRect?.width || 0);
  const containerHeight = $derived(containerRect?.height || 0);
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={containerElement}
  class={className}
  role="application"
  aria-label="Interactive grid navigation"
  tabindex="0"
  style:position="absolute"
  style:inset="0"
  style:touch-action="none"
  style:overflow="hidden"
  style:cursor={isDragging ? "grabbing" : "grab"}
  onmousedown={handleMouseDown}
  onmousemove={handleMouseMove}
  onmouseup={handleMouseUp}
  onmouseleave={handleMouseUp}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
  ontouchcancel={handleTouchEnd}
>
  <div
    style:position="absolute"
    style:inset="0"
    style:transform="translate3d({offset.x}px, {offset.y}px, 0)"
    style:will-change="transform"
  >
    {#each gridItems as item (item.position.x + "-" + item.position.y)}
      {@const x = item.position.x * gridSize + containerWidth / 2}
      {@const y = item.position.y * gridSize + containerHeight / 2}
      <div
        style:position="absolute"
        style:display="flex"
        style:align-items="center"
        style:justify-content="center"
        style:user-select="none"
        style:width="{gridSize}px"
        style:height="{gridSize}px"
        style:transform="translate3d({x}px, {y}px, 0)"
        style:margin-left="-{gridSize / 2}px"
        style:margin-top="-{gridSize / 2}px"
        style:will-change="transform"
      >
        {@render renderItem({
          gridIndex: item.gridIndex,
          position: item.position,
          isMoving,
        })}
      </div>
    {/each}
  </div>
</div>
