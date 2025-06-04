<script setup>
import { ref, onMounted } from 'vue';
import CartService from '@/services/CartService';
import MediaCartList from '@/components/MediaCartList.vue';

const cartItems = ref([]);

// Load cart items from the CartService
const loadCart = () => {
	cartItems.value = CartService.getCart();
};

// Remove all items from the cart
const clearCart = () => {
	CartService.clearCart();
	cartItems.value = [];
};

// Calculate the total price of items in the cart
const getTotal = () => {
	return (cartItems.value.reduce((total, item) => total + item.price, 0).toFixed(2)) / 100;
};

// Handle item removal from the cart
const handleItemRemoved = (id) => {
	cartItems.value = cartItems.value.filter((item) => item.id !== id);
};

// Proceed to checkout
const checkout = () => {
	CartService.checkout();
};

// Load cart items when the component is mounted
onMounted(() => {
	loadCart();
});
</script>

<template>
	<div class="cart">
		<h1>Panier</h1>
		<div v-if="cartItems.length === 0" class="empty-cart">
			Votre panier est vide
		</div>
		<div v-else>
			<MediaCartList :items="cartItems" @item-removed="handleItemRemoved" />
			<div class="cart-summary">
				<p class="total">Total: {{ getTotal() }} CHF</p>
				<button @click="clearCart" class="clear-button">Vider le panier</button>
				<button class="checkout-button" @click="checkout">Procéder au paiement</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.cart {
	padding: 20px;
	max-width: 800px;
	margin: 0 auto;
}

.empty-cart {
	text-align: center;
	padding: 40px;
	font-size: 1.2em;
}

.cart-summary {
	margin-top: 20px;
	padding: 20px;
	background-color: #1d1d1d;
	border-radius: 8px;
	text-align: right;
}

.total {
	font-size: 1.2em;
	font-weight: bold;
}

.clear-button, .checkout-button {
	width: auto;
	height: auto;
	margin-left: 10px;
}
</style>