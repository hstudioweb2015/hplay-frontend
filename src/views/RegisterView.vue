<script setup>
import RegisterForm from "@/components/RegisterForm.vue";
</script>

<template>
	<div class="register">
		<h1>S'inscrire</h1>
		<RegisterForm />
		<div class="register-form-footer">
			<p>Déjà inscrit ?</p>
			<RouterLink to="/login" class="register-form-link">Se connecter</RouterLink>
		</div>
	</div>
</template>

<style scoped>
.register {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
}
</style>