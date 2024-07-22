<script setup lang="ts">
import { onMounted, ref } from "vue";
import htmlColors from "html-colors/html-colors.json";
import { Color } from "./color";
import TargetColor from "./components/TargetColor.vue";

const colors = Object.entries(htmlColors).map(
	([name, hex]) => new Color(name, hex),
);

const target = ref<Color>(colors[0]);
const picked = ref<string>("#000000");
const gameOver = ref<boolean>(true);
const score = ref<number | null>(null);

const getRandomColor = () => {
	const index = Math.floor(Math.random() * colors.length);
	return colors[index];
};

const pickNewColor = () => {
	target.value = getRandomColor();
};

const getScore = () => {
	const distance = target.value.distanceCIELAB(picked.value);
	return Math.max(Math.floor((2000 - distance) / 20), 0);
};

const submitColor = () => {
	if (!target.value) {
		console.error("Target color is not defined!");
		return;
	}

	score.value = getScore();
	gameOver.value = true;
};

const reset = () => {
	pickNewColor();
	picked.value = "#000000";
	score.value = null;
	gameOver.value = false;
};

onMounted(() => {
	reset();
});
</script>

<template>
  <h1 class="text-2xl pb-4">ColorGuessr</h1>
  <p class="text-center">
    Welcome! Pick the color that matches as closely as possible to the HTML color chosen at random.
  </p>
  <div class="py-8 w-fit m-auto space-y-4">
    <div class="grid grid-cols-2 justify-center">
      <TargetColor :target="target" :game-over="gameOver" />
      <div>
        <p class="text-right italic invisible sm:visible">Input</p>
        <div class="w-full h-32" :style="{ 'background-color': picked }"></div>
      </div>
    </div>
    <p>Target color is <span class="font-mono uppercase">{{ gameOver ? target.hex : '#??????' }}</span>, picked color is <span class="font-mono uppercase">{{ picked }}</span></p>
    <div v-if="gameOver" class="flex flex-col justify-center items-center gap-4">
      <p>
        Score: <b>{{ score }}/100</b>
      </p>
      <button type="button" @click="reset" class="button">Play Again</button>
    </div>
    <form v-if="!gameOver" @submit.prevent="submitColor" class="flex flex-col gap-4 items-center">
      <label>
        Click to pick color:
        <input type="color" class="ml-1" v-model="picked" />
      </label>
      <button type="submit" class="button">Submit</button>
    </form>
  </div>
</template>
