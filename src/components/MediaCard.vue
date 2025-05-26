<script setup>
import Media from "@/libs/Media.js";
import TagList from "@/components/TagList.vue";
import {onMounted, ref} from "vue";

defineProps({
	media: {
		type: Media,
		required: true,
	},
	mediaType: {
		type: String,
		required: true,
		default: "store",
	},
});

// Limit title and description length
const truncate = (text, maxLength) => {
	return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

// Define chars limits for tags, title, and description
const tagsLimit = 4;
const titleLimit = 20;
const descriptionLimit = 50;
</script>

<template>
	<RouterLink :to="media.price > 0 ? `/${mediaType}/${media.id}` : `/media/${media.id}`">
		<div class="video-card" :key="media.id">
			<img :src="media.preview" :alt="media.name" class="video-thumbnail" />
			<div class="video-info">
				<h2 class="video-title">{{ truncate(media.name, titleLimit) }}</h2>
				<p class="video-description">{{ truncate(media.description, descriptionLimit) }}</p>
				<p v-if="media.price > 0" class="video-price">{{ media.price / 100 }} CHF</p>
				<p v-else class="video-price">Gratuit</p>
				<TagList :tags="media.tags" :tagsLimit="tagsLimit" />
			</div>
		</div>
	</RouterLink>

</template>

<style scoped>
.video-card {
	border-radius: 8px;
	overflow: hidden;
	width: 300px;
	background-color: #EA0029;
	transition: 0.2s;
}

.video-card:hover {
	box-shadow: 0 4px 8px rgba(0, 0, 0, 1);
	background-color: #ce0026;
	scale: 1.02;
	transition: 0.3s ease;
	
}

.video-thumbnail {
	width: 100%;
	height: 180px;
	object-fit: cover;
}

.video-info {
	padding: 1px 10px 10px;
}

.video-title {
	font-size: 18px;
	font-weight: bold;
	margin: 0 0 8px;
}

.video-description {
	font-size: 14px;
	margin: 0 0 8px;
}

.video-price {
	font-size: 16px;
	font-weight: bold;
	margin: 0 0 8px;
}
</style>