import ApiService from "@/services/ApiService.js";

/**
 * CartService class to manage the shopping cart
 */
export default class CartService {
	static KEY = 'shopping-cart';

	/**
	 * Get the shopping cart from local storage
	 * @returns {Array<Media>} - The shopping cart
	 */
	static getCart() {
		const cart = localStorage.getItem(this.KEY);
		return cart ? JSON.parse(cart) : [];
	}

	/**
	 * Add a media item to the shopping cart
	 * @param media {Media} - The media item to add
	 * @returns {Array<Media>} - The updated shopping cart
	 */
	static addMedia(media) {
		const cart = this.getCart();
		const existingItem = cart.find(item => item.id === media.id);

		if (!existingItem) {
			cart.push(media);
			localStorage.setItem(this.KEY, JSON.stringify(cart));
		}
		return cart;
	}

	/**
	 * Remove a media item from the shopping cart
	 * @param mediaId {number} - The ID of the media item to remove
	 * @returns {Array<Media>} - The updated shopping cart
	 */
	static removeMedia(mediaId) {
		const cart = this.getCart();
		const updatedCart = cart.filter(item => item.id !== mediaId);
		localStorage.setItem(this.KEY, JSON.stringify(updatedCart));
		return updatedCart;
	}

	/**
	 * Get the total price of the shopping cart
	 * @param mediaId {number} - The ID of the media item
	 * @returns {boolean}
	 */
	static isInCart(mediaId) {
		const cart = this.getCart();
		return cart.some(item => item.id === mediaId);
	}

	/**
	 * Get the total price of the shopping cart
	 * @returns {[]} - The total price of the shopping cart
	 */
	static clearCart() {
		localStorage.removeItem(this.KEY);
		return [];
	}
	
	static async checkout() {
		const cart = this.getCart();
		const body = {
			medias: cart.map(media => media.id),
			redirectUrl: window.location.origin + "/payment",
		};
		window.location = await ApiService.getPaymentUrl(body);
	}
}