<script setup>
import { ref, onMounted } from "vue";
import ApiService from "@/services/ApiService.js";

const emit = defineEmits(["update:medias"]);

const searchQuery = ref('');
const selectedTags = ref([]);
const tags = ref([]);
const isLoading = ref(false);

const props = defineProps({
	userId: {
		type: Number,
		default: false,
	},
	isAlreadyPurchased: {
		type: Boolean,
		default: false,
	},
});

// Fetch tags from the API
const fetchTags = async () => {
	let response = await ApiService.getAllTags();
	tags.value = response.map((tag) => tag.name);
	tags.value.sort((a, b) => a.localeCompare(b));
};

// Fetch medias from the API
const fetchMedias = async () => {
	// display loading message
	isLoading.value = true;
	
	let params = {
		name: searchQuery.value,
		limit: 20,
	};
	if (selectedTags.value.length > 0) {
		params.tags = selectedTags.value;
	}
	if (props.userId) {
		params.userId = parseInt(props.userId);
	}
	const response = await ApiService.searchMedias(params);
	
	// If the user has already purchased the media, filter them out
	if (props.isAlreadyPurchased || !props.userId) {
		isLoading.value = false;
		return response;
	} else {
		delete params.userId;
		const allMedias = await ApiService.searchMedias(params);
		const filteredMedias = allMedias.filter(media => 
			!response.some(purchasedMedia => purchasedMedia.id === media.id)
		);
		isLoading.value = false;
		return filteredMedias;
	}
};

// Filter medias based on search query and selected tags
const toggleTag = (tag) => {
	const index = selectedTags.value.indexOf(tag);
	if (index === -1) {
		selectedTags.value.push(tag);
	} else {
		selectedTags.value.splice(index, 1);
	}
	emitMedia();
};

// Update the list of medias based on the search query and selected tags
const emitMedia = async () => {
	const response = await fetchMedias();
	emit("update:medias", response); // Utilisation de emit
};

// Handle search input
const handleSearch = () => {
	emitMedia();
};

// Watch for changes in search query and selected tags
onMounted(() => {
	fetchTags();
	emitMedia();
});
</script>

<template>
	<div class="search-section">
		<div class="search-container">
			<input
					type="text"
					class="search-input"
					v-model="searchQuery"
					placeholder="Rechercher..."
					@keyup.enter="handleSearch"
			/>
		</div>
		<div class="tags-container">
      <span
					v-for="tag in tags"
					:key="tag"
					class="tag"
					:class="{ 'tag-selected': selectedTags.includes(tag) }"
					@click="toggleTag(tag)"
			>
        {{ tag }}
      </span>
		</div>
		<div v-if="isLoading" class="loading">
			Chargement...
		</div>
	</div>
</template>

<style scoped>
.search-section {
	margin-bottom: 30px;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.search-container {
	width: 100%;
	margin: 0 auto;
	display: flex;
	gap: 10px;
	justify-content: center;
}

.search-input {
	max-width: 600px;
	text-align: center;
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	justify-content: center;
	margin-top: 10px;
}

.tag {
	background-color: #1d1d1d;
	color: white;
	padding: 0 8px;
	border-radius: 20px;
	cursor: pointer;
	border: 2px solid #EA0029;
	transition: all 0.3s ease;
	font-size: 16px;
}

.tag:hover {
	background-color: #EA0029;
}

.tag-selected {
	background-color: #EA0029;
}

input {
	flex: 1;
	padding: 12px;
	border: 2px solid #EA0029;
	border-radius: 8px;
	font-size: 16px;
	background-color: #1d1d1d;
	color: white;
}

input:focus {
	outline: none;
	border-color: #ce0026;
}

.loading {
	text-align: center;
	font-size: 1.2em;
	color: #EA0029;
}

@media (max-width: 768px) {
	.search-container {
		flex-direction: column;
	}

	.search-input {
		max-width: 100%;
	}
}
</style>