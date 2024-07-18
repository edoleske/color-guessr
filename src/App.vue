<script setup lang="ts">
import { onMounted, ref } from "vue";
import htmlColors from "html-colors/html-colors.json";
import { Color } from "./color";

const colors = Object.entries(htmlColors).map(
	([name, hex]) => new Color(name, hex),
);

const targetSwatch = ref<HTMLDivElement | null>(null);
const target = ref<Color>(colors[0]);
const picked = ref<string>("#000000");

const getRandomColor = () => {
	const index = Math.floor(Math.random() * colors.length);
	return colors[index];
};

const pickNewColor = () => {
	target.value = getRandomColor();
	if (targetSwatch.value) {
		targetSwatch.value.style.backgroundColor = target.value.hex;
	}
};

const getScore = () => {
	const distance = target.value.weightedDistance(picked.value);
	return Math.floor((65025 - distance) / 650);
};

const submitColor = () => {
	if (!target.value) {
		console.error("Target color is not defined!");
		return;
	}

	const score = getScore();
	console.log(`Score: ${score}`);

	pickNewColor();
	picked.value = "#000000";
};

onMounted(() => {
	pickNewColor();
});
</script>

<template>
  <h1 class="text-2xl pb-4">ColorGuessr</h1>
  <p class="text-center">Welcome! Pick the color that matches as closely as possible to the HTML color chosen at random.</p>
  <div class="py-8 w-fit m-auto space-y-4">
    <div class="size-32 bg-gray-500" ref="targetSwatch"></div>
    <p>Current color is {{ target.hex }}, picked color is {{ picked }} (Distance: {{ Math.floor(target.weightedDistance(picked) ?? 1000) }})</p>
    <form @submit.prevent="submitColor" class="flex flex-col gap-4">
      <label>
      Your Color: 
      <input type="color" v-model="picked">
    </label>
    <button type="submit" class="bg-blue-800 hover:bg-blue-600 active:bg-blue-700 p-2 rounded-sm">Submit</button>
    </form>
  </div>
  
</template>
