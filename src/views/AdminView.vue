<script setup>
import { onMounted, ref } from 'vue';
import ApiService from "@/services/ApiService.js";
import Search from "@/components/Search.vue";

// Data for each section
const medias = ref([]);
const tags = ref([]);
const users = ref([]);
const newTagName = ref('');
const editingTag = ref(null); // Track which tag is being edited
const editedTagName = ref(''); // Store the edited tag name
const userSearchQuery = ref(''); // Search query for users

// Loading states
const loadingMedias = ref(true);
const loadingTags = ref(true);
const loadingUsers = ref(true);

// User search function
const searchUsers = async () => {
	loadingUsers.value = true;
	try {
		const usersResponse = await ApiService.searchUsers(userSearchQuery.value);
		users.value = usersResponse || [];
	} catch (error) {
		console.error("Error searching users:", error);
	} finally {
		loadingUsers.value = false;
	}
};

const deleteMedia = async (mediaId) => {
	if (!confirm("Êtes-vous sûr de vouloir supprimer ce média ?")) {
		return;
	}

	try {
		await ApiService.deleteMedia(mediaId);
		medias.value = medias.value.filter(media => media.id !== mediaId);
		alert("Média supprimé avec succès.");
	} catch (error) {
		console.error("Error deleting media:", error);
	}
};

// Add new tag
const addTag = async () => {
	if (!newTagName.value.trim()) return;

	try {
		const newTag = await ApiService.createTag(newTagName.value);
		tags.value.push(newTag);
		newTagName.value = '';
	} catch (error) {
		console.error("Error adding tag:", error);
	}
};

// Edit tag functions
const startEditTag = (tag) => {
	editingTag.value = tag.id;
	editedTagName.value = tag.name;
};

const saveEditedTag = async (tag) => {
	if (!editedTagName.value.trim() || editedTagName.value === tag.name) {
		// Cancel edit if empty or unchanged
		editingTag.value = null;
		return;
	}

	try {
		await ApiService.updateTag(tag.id, editedTagName.value);
		// Update the tag in the local array
		const index = tags.value.findIndex(t => t.id === tag.id);
		if (index !== -1) {
			tags.value[index].name = editedTagName.value;
		}
	} catch (error) {
		console.error("Error updating tag:", error);
	} finally {
		editingTag.value = null;
	}
};

// Delete tag function
const deleteTag = async (tagId) => {
	if (!confirm("Êtes-vous sûr de vouloir supprimer ce tag ?\n" +
			"Cette action supprimera toutes les références à ce tag.")) {
		return;
	}

	try {
		await ApiService.deleteTag(tagId);
		tags.value = tags.value.filter(tag => tag.id !== tagId);
	} catch (error) {
		console.error("Error deleting tag:", error);
	}
};

// Reset user password function
const resetPassword = async (userId) => {
	if (!confirm("Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet utilisateur ?")) {
		return;
	}

	try {
		await ApiService.resetUserPassword(userId);
		alert("Le mot de passe a été réinitialisé avec succès.");
	} catch (error) {
		console.error("Error resetting password:", error);
	}
};

const deleteUser = async (userId) => {
	if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
		return;
	}

	try {
		await ApiService.deleteUser(userId);
		users.value = users.value.filter(user => user.id !== userId);
	} catch (error) {
		console.error("Error deleting user:", error);
	}
};

// Load data when component mounts
onMounted(async () => {
	try {
		// Load tags data
		const tagsResponse = await ApiService.getAllTags();
		tags.value = tagsResponse || [];
		loadingTags.value = false;

		// Initial user search with empty query
		await searchUsers();
	} catch (error) {
		console.error("Error loading admin data:", error);
	}
});
</script>

<template>
	<div class="admin-container">
		<h1 class="admin-title">Administration</h1>

		<div class="admin-columns">
			<!-- Media Column -->
			<div class="admin-column">
				<h2>Médias</h2>
				<RouterLink to="/admin/add-media">
					<button class="add-media-btn">+ Ajouter un média</button>
				</RouterLink>

				<Search @update:medias="medias = $event; loadingMedias = false" />

				<div v-if="loadingMedias" class="loading">Chargement...</div>
				<div v-else-if="medias.length === 0" class="no-results">Aucun média trouvé</div>
				<div v-else class="media-grid">
					<div v-for="media in medias" :key="media.id" class="media-label">
						<div class="media-info">
							<div class="media-title">{{ media.name }}</div>
							<div class="media-description">{{ media.description }}</div>
						</div>
						<div class="item-actions">
							<RouterLink :to="'/admin/edit-media/' + media.id">
								<button class="edit-btn">Éditer</button>
							</RouterLink>
							<button class="delete-btn" @click="deleteMedia(media.id)">
								Supprimer
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Tags Column -->
			<div class="admin-column">
				<h2>Tags</h2>
				<div class="tag-add-form">
					<input
							type="text"
							v-model="newTagName"
							placeholder="Nom du tag"
							class="tag-input"
					/>
					<button @click="addTag" class="add-tag-btn">Ajouter</button>
				</div>

				<div v-if="loadingTags" class="loading">Chargement...</div>
				<div v-else-if="tags.length === 0" class="no-results">Aucun tag trouvé</div>
				<div v-else class="content-list">
					<div v-for="tag in tags" :key="tag.id" class="list-item">
						<div class="item-name" v-if="editingTag !== tag.id">
							{{ tag.name }}
						</div>
						<input
								v-else
								type="text"
								v-model="editedTagName"
								class="tag-edit-input"
								@keyup.enter="saveEditedTag(tag)"
								@keyup.esc="editingTag = null"
								ref="tagEditInput"
								autofocus
						/>
						<div class="item-actions">
							<button
									v-if="editingTag !== tag.id"
									class="edit-btn"
									@click="startEditTag(tag)">
								Éditer
							</button>
							<button
									v-else
									class="save-btn"
									@click="saveEditedTag(tag)">
								Enregistrer
							</button>
							<button class="delete-btn" @click="deleteTag(tag.id)">
								Supprimer
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Users Column -->
			<div class="admin-column">
				<h2>Utilisateurs</h2>

				<!-- User search form -->
				<div class="user-search-form">
					<input
							type="text"
							v-model="userSearchQuery"
							placeholder="Rechercher un utilisateur"
							class="user-search-input"
							@keyup.enter="searchUsers"
					/>
					<button @click="searchUsers" class="search-btn">Rechercher</button>
				</div>

				<div v-if="loadingUsers" class="loading">Chargement...</div>
				<div v-else-if="users.length === 0" class="no-results">Aucun utilisateur trouvé</div>
				<div v-else class="content-list">
					<div v-for="user in users" :key="user.id" class="list-item">
						<div class="item-info">
							<div class="item-name">{{ user.firstName }} {{ user.lastName }}</div>
							<div class="item-email">{{ user.email }}</div>
						</div>
						<div class="item-actions">
							<button class="reset-password-btn" @click="resetPassword(user.id)">Réinitialiser<br>mot de passe</button>
							<button class="delete-btn" @click="deleteUser(user.id)">Supprimer</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.user-search-form {
	display: flex;
	margin-bottom: 15px;
	gap: 8px;
}

.user-search-input {
	flex: 1;
	padding: 8px;
	border-radius: 4px;
	border: 1px solid #444;
	background-color: #333;
	color: white;
}

.search-btn {
	padding: 8px 15px;
	background-color: #3498db;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.tag-edit-input {
	flex: 1;
	padding: 5px 8px;
	border-radius: 4px;
	border: 1px solid #3498db;
	background-color: #333;
	color: white;
	margin-right: 20px;
}

.save-btn {
	width: 100px;
	padding: 5px 10px;
	background-color: #2ecc71;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.item-email {
	font-size: 0.9em;
	color: #aaa;
}
.reset-password-btn {
	padding: 5px 5px;
	background-color: #3498db;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	width: 150px;
}
.admin-container {
	padding: 20px;
	margin-top: 60px;
}

.admin-title {
	text-align: center;
	margin-bottom: 30px;
	color: white;
}

.admin-columns {
	display: flex;
	gap: 20px;
}

.admin-column {
	flex: 1;
	background-color: #2a2a2a;
	border-radius: 8px;
	padding: 15px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.admin-column h2 {
	text-align: center;
	margin-bottom: 15px;
	color: white;
	padding-bottom: 10px;
	border-bottom: 1px solid #444;
}

.loading {
	text-align: center;
	padding: 20px;
	color: #888;
}

.no-results {
	text-align: center;
	padding: 20px;
	color: #888;
}

.content-list {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.list-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	background-color: #333;
	border-radius: 4px;
	color: white;
}

/* Media grid styles */
.media-grid {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: 15px;
}

.media-label {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	background-color: #333;
	border-radius: 4px;
	color: white;
}

.media-info {
	flex: 1;
}

.media-title {
	font-weight: bold;
	margin-bottom: 3px;
}

.media-meta {
	font-size: 0.8em;
	color: #aaa;
}

.add-media-btn {
	width: 100%;
	padding: 10px;
	background-color: #2ecc71;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	margin-bottom: 15px;
	font-weight: bold;
}

/* Tag input styles */
.tag-add-form {
	display: flex;
	margin-bottom: 15px;
	gap: 8px;
}

.tag-input {
	flex: 1;
	padding: 8px;
	border-radius: 4px;
	border: 1px solid #444;
	background-color: #333;
	color: white;
}

.add-tag-btn {
	padding: 8px 15px;
	background-color: #2ecc71;
	margin-right: 10px;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.item-actions {
	display: flex;
	gap: 5px;
}

.edit-btn, .delete-btn, .add-btn {
	padding: 5px 10px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.edit-btn {
	width: 100px;
	background-color: #3498db;
	color: white;
}

.delete-btn {
	width: 120px;
	background-color: #e74c3c;
	color: white;
}

.add-btn {
	margin-top: 10px;
	padding: 8px;
	background-color: #2ecc71;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	text-align: center;
}

@media (max-width: 900px) {
	.admin-columns {
		flex-direction: column;
	}

	.admin-column {
		margin-bottom: 20px;
	}

	.tag-add-form {
		flex-direction: column;
	}
}
</style>