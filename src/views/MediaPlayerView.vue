<script setup>
import MediaList from "@/components/MediaList.vue";
import Media from "@/libs/Media.js";
import MediaPlayer from "@/components/MediaPlayer.vue";
import { useRoute } from "vue-router";
import {onMounted, ref} from "vue";
import ApiService from "@/services/ApiService.js";

let mediaId = useRoute().params.id;
let media = ref(null);
let recommendedMedias = ref([]);
let url = ref(null);

// Get the media data from the API
const loadMedia = async () => {
	//TODO: remove this and replace with API call
	return await ApiService.getMedia(mediaId);
}

// Get the recommended media data by tags from the API
const loadRecommendedMedias = async () => {
	//TODO: remove this and replace with API call
	const params = {
		tags: media.value.tags,
		limit: 2,
	};
	return await ApiService.searchMedias(params);
}

// Get the media token from the API
const loadMediaToken = async () => {
	return await ApiService.playMedia(mediaId);
}

// Load media, recommended media and token when the component is mounted
onMounted(async () => {
	media.value = await loadMedia();
	// check if user is connected or is free media
	if (!media.value || (media.value.price > 0 && !JSON.parse(localStorage.getItem('user')))) {
		window.location.href = '/store/' + mediaId;
		return;
	}
	recommendedMedias.value = await loadRecommendedMedias();
	try {
		url.value = await loadMediaToken();
	} catch (error) {
		console.error("Error loading media token:", error);
		window.location.href = '/store/' + mediaId;
		return;
	}
	
});
</script>

<template>
	<div class="media-view">
		<MediaPlayer v-if="media" :media="media" :url="url" />
		<div class="recommendations">
			<h2 class="recommendations-title">Recommandations</h2>
			<MediaList :medias="recommendedMedias"  items-type="store"/>
		</div>
	</div>
</template>

<style scoped>
.media-view {
	display: flex;
	gap: 20px;
	padding: 20px;
}

.recommendations {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.recommendations-title {
	text-align: center;
	color: white;
}

@media (max-width: 1024px) {
	.media-view {
		flex-direction: column;
	}

	.recommendations {
		width: 100%;
	}
}

@media (max-width: 768px) {
	.media-view {
		padding: 10px;
	}

	.recommendations-title {
		font-size: 1.2em;
	}
}
</style>