<script setup lang="ts">
import type { Color } from "../color";

const props = defineProps<{
	target: Color;
	gameOver: boolean;
}>();
</script>

<template>
  <div>
    <p><b>{{ target.name }}</b></p>
  <div class="w-full h-32" :class="{ 'bg-undefined': !props.gameOver }" :style="{ 'background-color': target.hex }"></div>
  </div>
</template>