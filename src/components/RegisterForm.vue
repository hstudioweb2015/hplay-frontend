<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthService from "@/services/AuthService.js";

const router = useRouter();
const firstName = ref(null);
const lastName = ref(null);
const email = ref(null);
const password = ref(null);
const confirmPassword = ref(null);
const errorMessage = ref(null);

const onSubmit = async () => {
	if (password.value !== confirmPassword.value) {
		errorMessage.value = "Les mots de passe ne correspondent pas.";
		return;
	}
	try {
		await AuthService.register(firstName.value, lastName.value, email.value, password.value);
		const redirectUrl = localStorage.getItem('redirectUrl') || '/';
		localStorage.removeItem('redirectUrl');
		await router.push(redirectUrl);
	} catch (error) {
		errorMessage.value = error.message;
	}
};
</script>

<template>
	<div class="register-form">
		<form @submit.prevent="onSubmit" class="register-form-inputs">
			<input type="text" v-model="firstName" placeholder="Prénom" required />
			<input type="text" v-model="lastName" placeholder="Nom" required />
			<input type="email" v-model="email" placeholder="Email" required />
			<input type="password" v-model="password" placeholder="Mot de passe" required />
			<input type="password" v-model="confirmPassword" placeholder="Confirmer le mot de passe" required />
			<div v-if="errorMessage" class="error-message">
				{{ errorMessage }}
			</div>
			<button type="submit" class="register-form-button">S'inscrire</button>
		</form>
	</div>
</template>

<style scoped>
.register-form {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	width: 100%;
}

.register-form-inputs {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 400px;
	align-items: center;
}

.register-form-inputs input {
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	width: 100%;
	text-align: center;
	margin: 5px 0 10px;
	font-size: 16px;
}

.register-form-button {
	margin: 10px 0;
}
</style>