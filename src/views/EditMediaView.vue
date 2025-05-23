<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ApiService from '@/services/ApiService';

const route = useRoute();
const router = useRouter();
const mediaId = route.params.id;

// State
const media = ref(null);
const name = ref('');
const description = ref('');
const price = ref(0);
const videoFile = ref(null);
const posterFile = ref(null);
const availableTags = ref([]);
const selectedTags = ref([]);
const newTagName = ref('');
const localTags = ref([]);
const loadingMedia = ref(true);
const loadingTags = ref(true);
const savingInfo = ref(false);
const uploadingVideo = ref(false);
const uploadingPoster = ref(false);
const errorMessage = ref('');
const infoMessage = ref('');
const uploadProgress = ref(0);
const showProgress = ref(false);

// Validation
const isFormValid = computed(() => {
	return name.value.trim() !== '' && description.value.trim() !== '';
});

// Load media data
const loadMedia = async () => {
	try {
		const mediaData = await ApiService.getMedia(mediaId);
		media.value = mediaData;
		name.value = mediaData.name;
		description.value = mediaData.description;
		price.value = mediaData.price / 100 || 0;

		// Clear existing selections
		selectedTags.value = [];

		// Wait for available tags to be loaded
		if (loadingTags.value) {
			await new Promise(resolve => {
				const checkTags = setInterval(() => {
					if (!loadingTags.value) {
						clearInterval(checkTags);
						resolve();
					}
				}, 100);
			});
		}

		// Match tags from media with available tags by name
		if (mediaData.tags && Array.isArray(mediaData.tags)) {
			mediaData.tags.forEach(mediaTag => {
				// Find matching tag in availableTags
				const matchingTag = availableTags.value.find(t =>
						typeof mediaTag === 'string' ? t.name === mediaTag : t.name === mediaTag.name
				);

				if (matchingTag) {
					selectedTags.value.push(matchingTag);
				} else if (typeof mediaTag === 'string') {
					// Create temporary tag if not found
					const tempTag = { id: `temp-${Date.now()}-${mediaTag}`, name: mediaTag };
					availableTags.value.push(tempTag);
					selectedTags.value.push(tempTag);
				} else if (mediaTag.name) {
					// Add the tag to available tags if it doesn't exist
					availableTags.value.push(mediaTag);
					selectedTags.value.push(mediaTag);
				}
			});
		}
	} catch (error) {
		console.error("Error loading media:", error);
		errorMessage.value = "Erreur lors du chargement du média";
	} finally {
		loadingMedia.value = false;
	}
};

// Load all available tags
const loadTags = async () => {
	try {
		const tagsResponse = await ApiService.getAllTags();
		availableTags.value = tagsResponse || [];
	} catch (error) {
		console.error("Error loading tags:", error);
	} finally {
		loadingTags.value = false;
	}
};

// Toggle tag selection
const toggleTag = (tag) => {
	const index = selectedTags.value.findIndex(t => t.id === tag.id);
	if (index === -1) {
		selectedTags.value.push(tag);
	} else {
		selectedTags.value.splice(index, 1);
	}
};

// Check if tag is selected
const isTagSelected = (tag) => {
	return selectedTags.value.some(t => t.id === tag.id);
};

// Add new tag locally
const addNewTag = () => {
	if (!newTagName.value.trim()) return;

	if (availableTags.value.some(tag => tag.name === newTagName.value.trim())) {
		errorMessage.value = "Ce tag existe déjà";
		return;
	}

	const tempTag = {
		id: `temp-${Date.now()}`,
		name: newTagName.value.trim(),
		isLocal: true
	};

	localTags.value.push(tempTag);
	availableTags.value.push(tempTag);
	selectedTags.value.push(tempTag);
	newTagName.value = '';
};

// Save media information
const saveMediaInfo = async () => {
	if (!isFormValid.value) return;

	savingInfo.value = true;
	errorMessage.value = '';
	infoMessage.value = '';

	try {
		const tagsToSend = selectedTags.value.map(tag => tag.name);

		await ApiService.updateMedia({
			id: mediaId,
			name: name.value,
			description: description.value,
			price: price.value * 100, // Convert to cents
			tags: tagsToSend
		});

		infoMessage.value = "Informations du média mises à jour avec succès";
	} catch (error) {
		console.error("Error updating media:", error);
		errorMessage.value = "Erreur lors de la mise à jour des informations";
	} finally {
		savingInfo.value = false;
	}
};

// Handle video file selection
const handleVideoChange = (event) => {
	const selectedFile = event.target.files[0];
	if (selectedFile) {
		videoFile.value = selectedFile;
	}
};

// Handle poster file selection
const handlePosterChange = (event) => {
	const selectedFile = event.target.files[0];
	if (selectedFile) {
		posterFile.value = selectedFile;
	}
};

// Upload video file
const uploadVideo = async () => {
	if (!videoFile.value) return;

	uploadingVideo.value = true;
	showProgress.value = true;
	uploadProgress.value = 0;
	errorMessage.value = '';
	infoMessage.value = '';

	try {
		await ApiService.uploadMediaFile(mediaId, videoFile.value, (progress) => {
			uploadProgress.value = progress;
		});

		infoMessage.value = "Fichier média mis à jour avec succès";
		videoFile.value = null;
	} catch (error) {
		console.error("Error uploading video:", error);
		errorMessage.value = "Erreur lors de l'upload du fichier média";
	} finally {
		uploadingVideo.value = false;
		showProgress.value = false;
	}
};

// Upload poster
const uploadPoster = async () => {
	if (!posterFile.value) return;

	uploadingPoster.value = true;
	showProgress.value = true;
	uploadProgress.value = 0;
	errorMessage.value = '';
	infoMessage.value = '';

	try {
		await ApiService.uploadThumbnail(mediaId, posterFile.value, (progress) => {
			uploadProgress.value = progress;
		});

		infoMessage.value = "Poster mis à jour avec succès";
		loadMedia(); // Reload to show new poster
		posterFile.value = null;
	} catch (error) {
		console.error("Error uploading poster:", error);
		errorMessage.value = "Erreur lors de l'upload du poster";
	} finally {
		uploadingPoster.value = false;
		showProgress.value = false;
	}
};

// Load data when component mounts
onMounted(() => {
	loadTags().then(() => loadMedia());
});
</script>

<template>
	<div class="edit-media-container">
		<h1 class="page-title">Modifier le média</h1>

		<div v-if="loadingMedia" class="loading-container">
			Chargement du média...
		</div>

		<div v-if="!loadingMedia" class="edit-sections">
			<div v-if="errorMessage" class="error-message">
				{{ errorMessage }}
			</div>

			<div v-if="infoMessage" class="info-message">
				{{ infoMessage }}
			</div>
			<!-- Media Info Section -->
			<div class="edit-section">
				<h2 class="section-title">Informations</h2>

				<div class="form-columns">
					<div class="form-column">
						<div class="form-group">
							<label for="name">Titre*</label>
							<input
									type="text"
									id="name"
									v-model="name"
									placeholder="Titre du média"
									class="form-input"
							/>
						</div>

						<div class="form-group">
							<label for="description">Description*</label>
							<textarea
									id="description"
									v-model="description"
									placeholder="Description du média"
									class="form-textarea"
							></textarea>
						</div>
					</div>

					<div class="form-column">
						<div class="form-group">
							<label for="price">Prix* (CHF)</label>
							<input
									type="number"
									id="price"
									v-model="price"
									min="0"
									step="0.01"
									class="form-input"
							/>
						</div>

						<div class="form-group">
							<label>Tags</label>
							<div v-if="loadingTags" class="loading">Chargement des tags...</div>
							<div v-else>
								<div class="tag-add-form">
									<input
											type="text"
											v-model="newTagName"
											placeholder="Ajouter un nouveau tag"
											class="tag-input"
											@keyup.enter="addNewTag"
									/>
									<button
											@click="addNewTag"
											class="add-tag-btn"
											:disabled="!newTagName.trim()"
									>
										Ajouter
									</button>
								</div>

								<div class="tags-container">
									<div
											v-for="tag in availableTags"
											:key="tag.id"
											class="tag-chip"
											:class="{
                        'selected': isTagSelected(tag),
                        'local-tag': tag.isLocal
                      }"
											@click="toggleTag(tag)"
									>
										{{ tag.name }}
										<span v-if="tag.count" class="tag-badge">{{ tag.count }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="section-actions">
					<button
							@click="saveMediaInfo"
							class="save-btn"
							:disabled="savingInfo"
					>
						{{ savingInfo ? 'Enregistrement...' : 'Enregistrer les informations' }}
					</button>
				</div>
			</div>

			<!-- Video File Section -->
			<div class="edit-section">
				<h2 class="section-title">Fichier média</h2>

				<div class="form-group">
					<label for="video-file">Nouveau fichier média</label>
					<input
							type="file"
							id="video-file"
							@change="handleVideoChange"
							class="form-file-input"
					/>
					<p class="file-info" v-if="videoFile">
						{{ videoFile.name }} ({{ (videoFile.size / 1024 / 1024).toFixed(2) }} MB)
					</p>
				</div>

				<!-- Progress Bar -->
				<div v-if="showProgress && uploadingVideo" class="upload-progress-container">
					<div class="progress-label">
						Upload en cours: {{ Math.round(uploadProgress) }}%
					</div>
					<div class="progress-bar-container">
						<div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
					</div>
				</div>

				<div class="section-actions">
					<button
							@click="uploadVideo"
							class="save-btn"
							:disabled="!videoFile || uploadingVideo"
					>
						{{ uploadingVideo ? 'Upload en cours...' : 'Mettre à jour le fichier' }}
					</button>
				</div>
			</div>

			<!-- Poster Section -->
			<div class="edit-section">
				<h2 class="section-title">Poster / Thumbnail</h2>

				<div class="form-group">
					<label for="poster-file">Nouveau poster</label>
					<input
							type="file"
							id="poster-file"
							@change="handlePosterChange"
							accept="image/*"
							class="form-file-input"
					/>
					<p class="file-info" v-if="posterFile">
						{{ posterFile.name }} ({{ (posterFile.size / 1024 / 1024).toFixed(2) }} MB)
					</p>
				</div>

				<!-- Progress Bar -->
				<div v-if="showProgress && uploadingPoster" class="upload-progress-container">
					<div class="progress-label">
						Upload en cours: {{ Math.round(uploadProgress) }}%
					</div>
					<div class="progress-bar-container">
						<div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
					</div>
				</div>

				<div class="current-poster" v-if="media && media.preview">
					<p>Poster actuel:</p>
					<img :src="media.preview" alt="Current poster" class="poster-preview" />
				</div>

				<div class="section-actions">
					<button
							@click="uploadPoster"
							class="save-btn"
							:disabled="!posterFile || uploadingPoster"
					>
						{{ uploadingPoster ? 'Upload en cours...' : 'Mettre à jour le poster' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.edit-media-container {
	padding: 20px;
	margin-top: 60px;
	color: white;
}

.page-title {
	text-align: center;
	margin-bottom: 30px;
	color: white;
}

.loading-container {
	text-align: center;
	padding: 50px;
	font-size: 1.2em;
	color: #aaa;
}

.edit-sections {
	max-width: 1200px;
	margin: 0 auto;
}

.edit-section {
	background-color: #2a2a2a;
	border-radius: 8px;
	padding: 20px;
	margin-bottom: 30px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.section-title {
	font-size: 1.5em;
	margin-top: 0;
	margin-bottom: 20px;
	padding-bottom: 10px;
	border-bottom: 1px solid #444;
}

.form-columns {
	display: flex;
	gap: 30px;
}

.form-column {
	flex: 1;
}

.form-group {
	margin-bottom: 20px;
}

.form-group label {
	display: block;
	margin-bottom: 8px;
	font-weight: bold;
}

.form-input, .form-textarea, .form-file-input {
	width: 100%;
	padding: 10px;
	border-radius: 4px;
	border: 1px solid #444;
	background-color: #333;
	color: white;
}

.form-textarea {
	resize: vertical;
	min-height: 150px;
}

.form-file-input {
	padding: 8px;
	background-color: #333;
}

.file-info {
	margin-top: 8px;
	font-size: 0.9em;
	color: #aaa;
}

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
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.add-tag-btn:disabled {
	background-color: #555;
	cursor: not-allowed;
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 10px;
}

.tag-chip {
	padding: 8px 12px;
	background-color: #333;
	border-radius: 20px;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.tag-chip.selected {
	background-color: #3498db;
}

.tag-chip.local-tag {
	border: 1px dashed #2ecc71;
}

.tag-chip.local-tag.selected {
	background-color: #27ae60;
}

.tag-badge {
	font-size: 0.7em;
	background-color: rgba(0, 0, 0, 0.2);
	padding: 2px 6px;
	border-radius: 10px;
	margin-left: 5px;
}

.section-actions {
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
}

.save-btn {
	padding: 10px 20px;
	background-color: #2ecc71;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-weight: bold;
}

.save-btn:disabled {
	background-color: #555;
	cursor: not-allowed;
}

.current-poster {
	margin-top: 15px;
}

.poster-preview {
	max-width: 200px;
	max-height: 200px;
	border: 1px solid #444;
	border-radius: 4px;
}

.upload-progress-container {
	margin: 20px 0;
}

.progress-label {
	margin-bottom: 5px;
	font-size: 0.9em;
	color: #aaa;
}

.progress-bar-container {
	height: 20px;
	background-color: #333;
	border-radius: 10px;
	overflow: hidden;
}

.progress-bar {
	height: 100%;
	background-color: #2ecc71;
	transition: width 0.3s ease;
}

.info-message {
	background-color: rgba(46, 204, 113, 0.2);
	border-left: 4px solid #2ecc71;
	padding: 10px;
	margin-bottom: 20px;
	color: #2ecc71;
}

.error-message {
	background-color: rgba(231, 76, 60, 0.2);
	border-left: 4px solid #e74c3c;
	padding: 10px;
	margin-bottom: 20px;
	color: #e74c3c;
}

.form-actions {
	display: flex;
	justify-content: center;
	margin-top: 30px;
}

.cancel-btn {
	padding: 10px 20px;
	background-color: #555;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

@media (max-width: 768px) {
	.form-columns {
		flex-direction: column;
	}

	.section-actions {
		justify-content: center;
	}
}
</style>