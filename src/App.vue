<script setup lang="ts">
import { onMounted, ref } from "vue";
import htmlColors from "html-colors/html-colors.json";

const hexValues = Object.values(htmlColors);

const targetSwatch = ref<HTMLDivElement | null>(null);
const target = ref<string>("");
const picked = ref<string>("#000000");

function hexToRgb(hex: string) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: Number.parseInt(result[1], 16),
				g: Number.parseInt(result[2], 16),
				b: Number.parseInt(result[3], 16),
			}
		: null;
}

const weightedEuclideanDistance = (
	a: { r: number; g: number; b: number },
	b: { r: number; g: number; b: number },
) => {
	const dr = (a.r - b.r) ** 2;
	const dg = (a.g - b.g) ** 2;
	const db = (a.b - b.b) ** 2;
	return 0.3 * dr + 0.59 * dg + 0.11 * db;
};

const scoreColors = (a: string, b: string) => {
	const argb = hexToRgb(a);
	const brgb = hexToRgb(b);
	if (argb && brgb) {
		return weightedEuclideanDistance(argb, brgb);
	}
	return null;
};

const getRandomColor = () => {
	const index = Math.floor(Math.random() * hexValues.length);
	return hexValues[index];
};

const pickNewColor = () => {
	if (targetSwatch.value) {
		target.value = getRandomColor();
		targetSwatch.value.style.backgroundColor = target.value;
	}
};

const submitColor = () => {
	if (!target.value) {
		console.error("Target color is not defined!");
		return;
	}

	const score = scoreColors(target.value, picked.value);
	console.log(`Score: ${1000 - (score ?? 0)}`);

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
    <p>Current color is {{ target }}, picked color is {{ picked }} (Distance: {{ Math.floor(scoreColors(target, picked) ?? 1000) }})</p>
    <form @submit.prevent="submitColor" class="flex flex-col gap-4">
      <label>
      Your Color: 
      <input type="color" v-model="picked">
    </label>
    <button type="submit" class="bg-blue-800 hover:bg-blue-600 active:bg-blue-700 p-2 rounded-sm">Submit</button>
    </form>
  </div>
  
</template>
