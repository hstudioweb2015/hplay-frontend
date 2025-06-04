<script setup>
import CartService from "@/services/CartService.js";

let urlParams = new URLSearchParams(window.location.search);

if (urlParams.get('status') === 'success') {
	CartService.clearCart();
}
</script>

<template>
	<div class="payment" v-if="urlParams.get('status') === 'success'">
		<h1 >Confirmation de paiement</h1>
		<p class="payment-status">
			Votre paiement a été effectué avec succès.
		</p>
		<RouterLink to="/my-media" class="btn">
			Retourner à mes médias
		</RouterLink>
	</div>
	<div class="payment" v-else-if="urlParams.get('status') === 'failed'">
		<h1 >Échec du paiement</h1>
		<p class="payment-status">
			Une erreur est survenue lors du traitement de votre paiement.
		</p>
		<RouterLink to="/store" class="btn">
			Retourner au magasin
		</RouterLink>
	</div>
</template>

<style scoped>
.payment {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
}
.payment h1 {
	margin-bottom: 20px;
}
.payment-status {
	text-align: center;
	font-size: 1.2em;
}
.btn {
	background-color: #007bff;
	color: white;
	padding: 10px 20px;
	border-radius: 5px;
	text-decoration: none;
	margin-top: 20px;
}
</style>