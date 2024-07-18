<script setup lang="ts">
import type { Color } from "../color";

const props = defineProps<{
	target: Color;
	gameOver: boolean;
}>();
</script>

<template>
  <p><b>{{ target.name }}</b></p>
  <div class="size-32" :class="{ 'bg-undefined': !props.gameOver }" :style="{ 'background-color': target.hex }"></div>
</template>