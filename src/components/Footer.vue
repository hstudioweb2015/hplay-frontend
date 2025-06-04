<script setup>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faInstagram, faFacebook, faLinkedin, faWhatsapp} from '@fortawesome/free-brands-svg-icons';

// Import icon from FontAwesome
library.add(faInstagram, faFacebook, faLinkedin, faWhatsapp);
</script>

<template>
	<footer>
		<div class="content">
			<div>
				<h2>Adresse</h2>
				<hr>
				<p>Rue du Stand 4</p>
				<p>1450 Sainte-Croix</p>
				<h2>Contact</h2>
				<hr>
				<p>024 454 14 89</p>
				<a href="mailto:info@hstudio.ch">info@hstudio.ch</a>
				<a href="https://hstudio.ch" target="_blank" rel="noopener noreferrer">hstudio.ch</a>
				<div class="links">
					<a href="https://www.instagram.com/hstudio1450/" target="_blank" rel="noopener noreferrer">
						<FontAwesomeIcon class="link" :icon="['fab', 'instagram']"/>
					</a>
					<a href="https://www.facebook.com/hstudio1450" target="_blank" rel="noopener noreferrer">
						<FontAwesomeIcon class="link" :icon="['fab', 'facebook']"/>
					</a>
					<a href="https://ch.linkedin.com/company/hstudio-jordan-hertig" target="_blank"
						 rel="noopener noreferrer">
						<FontAwesomeIcon class="link" :icon="['fab', 'linkedin']"/>
					</a>
					<a href="https://wa.me/+41244541489" target="_blank" rel="noopener noreferrer">
						<FontAwesomeIcon class="link" :icon="['fab', 'whatsapp']"/>
					</a>
				</div>
				<hr>
				<p>Copyright © 2025 HStudio - Jordan Hertig</p>
			</div>
			<RouterLink to="/">
				<img src="../assets/logoHPlayNB.png" alt="Logo" class="logo"/>
			</RouterLink>
		</div>
	</footer>
</template>

<style scoped>
footer {
	width: 100%;
	background-color: #EA0029;
	color: white;
	padding: 2rem 0;
	position: absolute;
	bottom: 0;
}

.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	max-width: 1000px;
	margin: 0 auto;
	gap: 50px;
	padding: 0 2rem;
}

.logo {
	width: 300px;
	margin-bottom: 1rem;
}

.links {
	display: flex;
	gap: 1rem;
}

.link {
	color: white;
	font-size: 2rem;
}

footer > .content > div {
	display: flex;
	flex-direction: column;
	gap: 0.7rem;
}

@media (max-width: 768px) {
	.content {
		flex-direction: column; /* Stack elements vertically */
		align-items: center;
		text-align: center;
	}

	.logo {
		margin-top: 1rem; /* Add spacing above the logo */
	}

	.links {
		justify-content: center; /* Center the links */
	}
}
</style>