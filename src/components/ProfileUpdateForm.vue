<script setup>
import {defineProps, ref} from "vue";
import { useRouter } from "vue-router";
import AuthService from "@/services/AuthService.js";
import User from "@/libs/User.js";

const router = useRouter();
const props = defineProps( {
	user: {
		type: User,
		required: true
	}
});
const password = ref(null);
const confirmPassword = ref(null);
const errorMessage = ref(null);
const successMessage = ref(null);

const updateProfile = async () => {
	errorMessage.value = null;
	successMessage.value = null;
	if (password.value !== null && password.value !== confirmPassword.value) {
		errorMessage.value = "Les mots de passe ne correspondent pas.";
		return;
	}
	try {
		await AuthService.updateUser(props.user, password.value);
		successMessage.value = "Profil mis à jour avec succès.";
	} catch (error) {
		errorMessage.value = error.message;
	}
};
</script>

<template>
	<form @submit.prevent="updateProfile" class="profile-update-form">
		<div class="form-group">
			<label for="firstName">Prénom</label>
			<input type="text" v-model="user.firstName" id="firstName" required />
		</div>
		<div class="form-group">
			<label for="lastName">Nom</label>
			<input type="text" v-model="user.lastName" id="lastName" required />
		</div>
		<div class="form-group">
			<label for="password">Mot de passe</label>
			<input type="password" v-model="password" id="password" />
		</div>
		<div class="form-group">
			<label for="confirmPassword">Confirmer le mot de passe</label>
			<input type="password" v-model="confirmPassword" id="confirmPassword" />
		</div>
		<div v-if="errorMessage" class="error-message">
			{{ errorMessage }}
		</div>
		<div v-if="successMessage" class="success-message">
			{{ successMessage }}
		</div>
		<button type="submit">Mettre à jour</button>
		
	</form>
</template>

<style scoped>
.profile-update-form {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	width: 100%;
}
.form-group {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 400px;
	align-items: center;
	margin-bottom: 10px;
}
.form-group input {
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	width: 100%;
	text-align: center;
	margin: 5px 0 10px;
}
.form-group label {
	margin-bottom: 5px;
}
button {
	margin-bottom: 20px;
	background-color: #008c1b;
}

button:hover {
	background-color: #005f14;
}

</style>