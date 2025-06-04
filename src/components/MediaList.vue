<script setup>
import MediaCard from "@/components/MediaCard.vue";
import Media from "@/libs/Media.js";

// type define if the items is store or media
defineProps({
	medias: {
		type: Array,
		required: true,
		validator: (value) => value.every((item) => item instanceof Media),
	},
	itemsType: {
		type: String,
		required: true,
		default: 'store',
	},
});
</script>

<template>
	<div class="media-list">
		<MediaCard class="media-card" v-for="media in medias" :key="media.id" :media="media" :mediaType="itemsType" />
	</div>
</template>

<style scoped>
.media-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 20px;
	padding: 20px;
}
</style>