<script setup>
import AuthService from "@/services/AuthService.js";
import { useRouter } from "vue-router";
import { ref } from "vue";
import ProfileUpdateForm from "@/components/ProfileUpdateForm.vue";

const router = useRouter();
const user = ref(JSON.parse(localStorage.getItem("user")));

const handleLogout = async() => {
	await AuthService.logout();
	await router.push("/");
};
</script>

<template>
	<div class="profile">
		<h1>Mon Profil</h1>
		<ProfileUpdateForm :user="user" />
		<button @click="handleLogout" class="profile-logout-button">Se déconnecter</button>
	</div>
</template>

<style scoped>
.profile {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
}
</style>