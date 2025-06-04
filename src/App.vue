<script setup>
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import AuthService from "@/services/AuthService.js";

const loading = ref(true);

onMounted(async () => {
	await AuthService.isLoggedIn();
	loading.value = false;
});
</script>

<template>
	<div v-if="!loading">
		<Navbar/>
		<RouterView class="main"/>
		<Footer/>
	</div>
</template>

<style scoped>
.main {
	min-height: calc(100vh - 85px);
}
</style>