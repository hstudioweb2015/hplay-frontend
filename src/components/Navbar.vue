<script setup>
import {RouterLink} from 'vue-router'
import {onMounted, ref, watchEffect} from 'vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import { isLoggedIn } from '@/stores/auth.js';

library.add(faBars);

const isMenuOpen = ref(false)
const user = ref(null);

watchEffect(() => {
	if (isLoggedIn.value) {
		user.value = JSON.parse(localStorage.getItem('user'));
	} else {
		user.value = null;
	}
})

// Manage the burger menu state for mobile view
const toggleMenu = (event) => {
	if (event.target.closest('.burger-menu')) {
		isMenuOpen.value = !isMenuOpen.value;
	} else {
		isMenuOpen.value = false;
	}
}

// Close the menu when clicking outside the menu
onMounted(() => {
	document.addEventListener('click', toggleMenu)
})
</script>

<template>
	<nav class="navbar">
		<!-- Logo -->
		<div class="logo">
			<RouterLink to="/">
				<img src="@/assets/logo.png" alt="Logo"/>
			</RouterLink>
		</div>

		<!-- Burger Menu -->
		<FontAwesomeIcon class="burger-menu" icon="fa-solid fa-bars" />

		<!-- Menu Links -->
		<ul class="menu" :class="{ open: isMenuOpen }">
			<li>
				<RouterLink to="/">Home</RouterLink>
			</li>
			<li>
				<RouterLink to="/store">Magasin</RouterLink>
			</li>
			<li v-if="isLoggedIn">
				<RouterLink to="/my-media">Mes Médias</RouterLink>
			</li>
			<li>
				<RouterLink to="/about">À propos</RouterLink>
			</li>
			<li>
				<RouterLink to="/cart">Panier</RouterLink>
			</li>
			<li v-if="!isLoggedIn">
				<RouterLink to="/login">Connexion</RouterLink>
			</li>
			<li v-else>
				<RouterLink to="/profile">
					{{ user.firstName }} {{ user.lastName }}
				</RouterLink>
			</li>
			<li v-if="isLoggedIn && user.isAdmin">
				<RouterLink to="/admin">Admin</RouterLink>
			</li>
		</ul>
	</nav>
</template>

<style scoped>
.navbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	background-color: #1d1d1d;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 1000;
}

.logo img {
	height: 40px;
}

.burger-menu {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	width: 40px;
	height: 40px;
	cursor: pointer;
}

.burger-menu span {
	display: block;
	height: 3px;
	background-color: #333;
	border-radius: 2px;
}

.menu {
	display: none;
	flex-direction: column;
	position: absolute;
	top: 60px;
	right: 1rem;
	background-color: black;
	border: 1px solid #ddd;
	border-radius: 5px;
	padding: 1rem;
	z-index: 1000;
	align-items: center;
}

.menu.open {
	display: flex;
}

.menu li {
	margin: 0.5rem 0;
	text-align: center;
}

.menu a {
	text-decoration: none;
	font-size: 1.4rem;
	color: white;
	font-weight: bold;
}

.menu a.router-link-exact-active {
	color: red;
}

@media (min-width: 768px) {
	.burger-menu {
		display: none;

	}

	.menu {
		display: flex;
		position: static;
		flex-direction: row;
		background: none;
		border: none;
		padding: 0;

	}

	.menu li {
		margin: 0 1rem;
	}
}
</style>