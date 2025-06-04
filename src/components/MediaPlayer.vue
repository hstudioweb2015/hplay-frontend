<script setup>
import Media from "@/libs/Media.js";
import {defineProps, ref} from "vue";
import TagList from "@/components/TagList.vue";

defineProps({
	media: {
		type: Media,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
});

</script>

<template>
	<div class="video-section">
		<iframe
				v-if="url"
				class="video-player"
				:src="`${url}`"
				allow="autoplay; fullscreen; picture-in-picture"
				allowfullscreen
				
		/>
		<div class="video-info">
			<h2 class="video-title">{{ media.name }}</h2>
			<p class="video-description">
				{{ media.description }}
			</p>
		</div>
		<TagList :tags="media.tags" />
	</div>
</template>

<style scoped>
.video-section {
	flex: 3;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.video-player {
	width: 100%;
	aspect-ratio: 16 / 9;
	border-radius: 8px;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
	border: none;
}

.video-info {
	padding: 10px;
	border-radius: 8px;
}

.video-title {
	font-size: 2em;
	font-weight: bold;
	margin-bottom: 10px;
}

.video-description {
	font-size: 1.2em;
	line-height: 1.6;
}

.video-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	margin-top: 10px;
}

.video-tag {
	background-color: #EA0029;
	color: white;
	padding: 5px 10px;
	border-radius: 5px;
	font-size: 1em;
}

@media (max-width: 480px) {
	.video-info {
		padding: 5px;
	}

	.video-title {
		font-size: 1.2em;
	}
}

@media (max-width: 768px) {
	.video-title {
		font-size: 1.5em;
	}

	.video-description {
		font-size: 1em;
	}
}
</style>