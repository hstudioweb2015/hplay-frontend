<script setup>
import { defineProps, defineEmits } from 'vue';
import MediaCartCard from './MediaCartCard.vue';

defineProps({
	items: {
		type: Array,
		required: true,
	},
});

// Emit an event when an item is removed to the parent component
const emit = defineEmits(['item-removed']);
</script>

<template>
	<div class="cart-items">
		<MediaCartCard
				v-for="item in items"
				:key="item.id"
				:item="item"
				@item-removed="emit('item-removed', $event)"
		/>
	</div>
</template>

<style scoped>
.cart-items {
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>