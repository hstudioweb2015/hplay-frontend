<script setup>
import { defineProps, defineEmits } from 'vue';
import CartService from '@/services/CartService';
import Media from "@/libs/Media.js";

const props = defineProps({
	item: {
		type: Media,
		required: true,
	},
});

const emit = defineEmits(['item-removed']);

const removeFromCart = () => {
	CartService.removeMedia(props.item.id);
	emit('item-removed', props.item.id);
};
</script>

<template>
	<div class="cart-item">
		<img :src="item.preview" :alt="item.name" class="item-preview" />
		<div class="item-info">
			<h3>{{ item.name }}</h3>
			<p>{{ item.price / 100 }} CHF</p>
		</div>
		<button @click="removeFromCart" class="remove-button">Supprimer</button>
	</div>
</template>

<style scoped>
.cart-item {
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 20px;
	background-color: #1d1d1d;
	border-radius: 8px;
}

.item-preview {
	width: 100px;
	height: 60px;
	object-fit: cover;
	border-radius: 4px;
}

.item-info {
	flex-grow: 1;
}

.remove-button {
	width: auto;
	height: auto;
}
</style>