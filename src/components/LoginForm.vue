<script setup>
import { ref } from 'vue';
import AuthService from "@/services/AuthService.js";
import { useRouter } from "vue-router";

const email = ref('');
const password = ref('');
const router = useRouter();
const onSubmit = async() => {
	try {
		await AuthService.login(email.value, password.value);
		const redirectUrl = localStorage.getItem('redirectUrl') || '/';
		localStorage.removeItem('redirectUrl');
		await router.push(redirectUrl);
	} catch (error) {
		console.error("Login failed:", error);
		alert("Échec de la connexion. Veuillez vérifier vos identifiants.");
	}
};
	
</script>

<template>
	<div class="login-form">
		<form @submit.prevent="onSubmit" class="login-form">
			<div class="login-form-inputs">
				<input type="email" v-model="email" placeholder="Email" required />
				<input type="password" v-model="password" placeholder="Mot de passe" required />
			</div>
			<button type="submit" class="login-form-button">Se connecter</button>
			<div class="login-form-footer">
				<p>Pas encore de compte ?</p>
				<RouterLink to="/register" class="login-form-link">S'inscrire</RouterLink>
			</div>
		</form>
	</div>
</template>

<style scoped>
.login-form {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	width: 100%;
}

.login-form-inputs {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 400px;
	align-items: center;
}

.login-form-inputs input {
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	width: 100%;
	text-align: center;
	margin: 5px 0 10px;
	font-size: 16px;
}

.login-form-button {
	margin: 10px 0;
}
</style>