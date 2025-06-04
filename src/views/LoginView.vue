<script setup>

import LoginForm from "@/components/LoginForm.vue";
</script>

<template>
	<div class="login">
		<h1>Connexion</h1>
		<LoginForm />
	</div>
</template>

<style scoped>
.login {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
}
</style>