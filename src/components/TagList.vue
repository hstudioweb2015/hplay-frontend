<script setup>
import { defineProps } from 'vue';

defineProps({
	tags: {
		type: Array,
		required: true,
	},
	tagsLimit: {
		type: Number,
		default: 999,
	}
});
</script>

<template>
	<div class="video-tags">
		<span v-for="(tag) in tags.slice(0, tagsLimit)" :key="tag" class="video-tag">
			{{ tag }}
		</span>
		<span v-if="tags.length > tagsLimit && tagsLimit !== 0" class="video-tag">...</span>
	</div>
</template>

<style scoped>
.video-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.video-tag {
	background-color: #f0f0f0;
	border-radius: 4px;
	padding: 4px 8px;
	font-size: 12px;
	color: #333;
	font-weight: bold;
}
</style>