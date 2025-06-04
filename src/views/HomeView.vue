<script setup>
import Media from "@/libs/Media.js";
import MediaList from "@/components/MediaList.vue";
import { ref, onMounted } from "vue";
import ApiService from "@/services/ApiService.js";

let medias = ref([]);

// Get the media list from the API
const loadMedias = async () => {
	//TODO: remove this and replace with API call
	let medias = await ApiService.searchMedias({});
	return medias;
};

// Load the media list when the component is mounted
onMounted(async () => {
	medias.value = await loadMedias();
});

</script>

<template>
	<div class="home">
		<img src="@/assets/menSeeScreen.jpg" class="menSeeScreen" alt="men see screen"/>
		<h1>Dernière sortie</h1>
		<MediaList :medias="medias" :itemsType="'store'" />
		<h1>En voir plus</h1>
		<RouterLink to="/store">
			<button class="button-store">Aller dans le store</button>
		</RouterLink>
	</div>
</template>

<style scoped>
.menSeeScreen {
	width: 100%;
	height: 100vh;
	object-fit: cover;
	top: 0;
	left: 0;
}
.button-store {
	display: block;
	margin: 1px auto;
}
</style>