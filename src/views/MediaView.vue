<script setup>
import {ref, onMounted} from "vue";
import MediaPreview from "@/components/MediaPreview.vue";
import Media from "@/libs/Media.js";
import {useRoute} from "vue-router";
import Api from "@/services/ApiService.js";
import ApiService from "@/services/ApiService.js";
let mediaId =  useRoute().params.id;

const media = ref(null);

// Get the media data from the API
const loadMedia = async () => {
	//TODO: check if media is already bought by the user
	const mediaData = await ApiService.getMedia(mediaId);
	if ((await ApiService.searchMedias({
		name: mediaData.name,
		limit: 1,
		tags: mediaData.tags,
		userId: parseInt(JSON.parse(localStorage.getItem('user'))?.id)
	})).length > 0) {
		window.location.href = `/media/${mediaId}`;
	} else {
		return mediaData;
	}
}

// Load media when the component is mounted
onMounted(async () => {
	media.value = await loadMedia();
});
</script>

<template>
	<div class="media-view">
		<MediaPreview v-if="media" :media="media" />
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

@media (max-width: 768px) {
	.media-view {
		flex-direction: column;
	}
}
</style>