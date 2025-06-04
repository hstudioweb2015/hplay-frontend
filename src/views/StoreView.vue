<<script setup>
import { ref } from "vue";
import MediaList from "@/components/MediaList.vue";
import Search from "@/components/Search.vue";

const userId = parseInt(JSON.parse(localStorage.getItem('user'))?.id) || null;
const medias = ref([]);
console.log(userId);
</script>

<template>
	<div class="store">
		<h1 class="store-title">Magasin</h1>
		<Search v-if="!userId" @update:medias="medias = $event" />
		<Search v-else @update:medias="medias = $event" :userId="userId" />
		<div>
			<MediaList :medias="medias" :itemsType="'store'" />
		</div>
	</div>
</template>

<style scoped>
.store {
	padding: 20px;
}
</style>