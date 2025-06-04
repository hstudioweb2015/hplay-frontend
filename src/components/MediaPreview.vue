<script setup>
import Media from "@/libs/Media.js";
import BuyButton from "@/components/BuyButton.vue";
import TagList from "@/components/TagList.vue";

defineProps({
	media: {
		type: Media,
		required: true,
		validator: (value) => value instanceof Media,
	},
});
</script>

<template>
	<div class="media-view">
		<img :src="media.preview" class="media-preview" alt="Media preview"/>
		<div class="media-info">
			<h2 class="media-title">{{ media.name }}</h2>
			<p class="media-description">{{ media.description }}</p>
			<BuyButton :media="media" />
			<TagList :tags="media.tags" />
		</div>
	</div>
</template>

<style scoped>
.media-view {
	display: flex;
	gap: 20px;
	padding: 20px;
	align-items: center;
	text-align: center;
}

.media-preview {
	width: 60%;
	aspect-ratio: 16/9;
	object-fit: cover;
	top: 0;
	left: 0;
}
.media-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
}

.media-title {
	font-size: 24px;
	font-weight: bold;
}

.media-description {
	font-size: 16px;
	margin: 0 0 8px;
}

@media (max-width: 768px) {
	.media-view {
		flex-direction: column;
	}
	.media-preview {
		width: 100%;
	}
}
</style>