<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from "@/services/ApiService.js";

const router = useRouter();

// Form data
const title = ref('');
const description = ref('');
const price = ref(0); // Replace type with price
const file = ref(null);
const poster = ref(null);
const availableTags = ref([]);
const selectedTags = ref([]);
const newTagName = ref('');
const localTags = ref([]); // Store newly added tags locally
const loadingTags = ref(true);
const isUploading = ref(false);
const errorMessage = ref('');
const uploadProgress = ref(0);
const showProgress = ref(false);

// Validation
const isFormValid = computed(() => {
	return title.value.trim() !== '' &&
			description.value.trim() !== '' &&
			file.value !== null;
});

// Handle file selection
const handleFileChange = (event) => {
	const selectedFile = event.target.files[0];
	if (selectedFile) {
		file.value = selectedFile;
	}
};

// Handle poster selection
const handlePosterChange = (event) => {
	const selectedFile = event.target.files[0];
	if (selectedFile) {
		poster.value = selectedFile;
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

// Add new tag locally only
const addNewTag = () => {
	if (!newTagName.value.trim()) return;
	// Check if tag already exists
	if (availableTags.value.some(tag => tag.name === newTagName.value.trim())) {
		errorMessage.value = 'Ce tag existe déjà.';
		return;
	}

	// Create a temporary local tag with a unique temporary ID
	const tempTag = {
		id: `temp-${Date.now()}`,
		name: newTagName.value.trim()
	};

	// Add to available tags and select it
	localTags.value.push(tempTag);
	availableTags.value.push(tempTag);
	selectedTags.value.push(tempTag);
	newTagName.value = '';
};

// Submit form
const submitForm = async () => {
	if (!isFormValid.value) return;

	isUploading.value = true;
	showProgress.value = true;
	uploadProgress.value = 0;
	errorMessage.value = '';
	const tags = selectedTags.value.map(tag => tag.name);

	try {
		const media = await ApiService.createMedia({
			name: title.value,
			description: description.value,
			price: price.value * 100, // Convert to cents
			tags: tags
		});

		// Upload with progress tracking
		await ApiService.uploadMediaFile(media.id, file.value, (progress) => {
			uploadProgress.value = progress;
		});

		uploadProgress.value = 100;

		if (poster.value) {
			uploadProgress.value = 0;
			await ApiService.uploadThumbnail(media.id, poster.value, (progress) => {
				uploadProgress.value = progress;
			});
		}

		// Navigate back to admin page after successful upload
		router.push('/admin');
	} catch (error) {
		console.error('Error uploading media:', error);
		errorMessage.value = 'Une erreur est survenue lors de l\'upload du média.';
	} finally {
		isUploading.value = false;
		showProgress.value = false;
	}
};

// Load available tags
const loadTags = async () => {
	try {
		const tagsResponse = await ApiService.getAllTags();
		availableTags.value = tagsResponse || [];
	} catch (error) {
		console.error('Error loading tags:', error);
	} finally {
		loadingTags.value = false;
	}
};

// Load tags when component mounts
loadTags();
</script>

<template>
	<div class="add-media-container">
		<h1 class="page-title">Ajouter un média</h1>
		<div v-if="errorMessage" class="error-message">
			{{ errorMessage }}
		</div>
		<div class="form-container">
			<div class="form-columns">
				<!-- Left Column: Title and Description -->
				<div class="form-column">
					<div class="form-group">
						<label for="title">Titre*</label>
						<input
								type="text"
								id="title"
								v-model="title"
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
								rows="10"
						></textarea>
					</div>
				</div>

				<!-- Right Column: Files, Price, Tags -->
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
						<label for="file">Media*</label>
						<input
								type="file"
								id="file"
								@change="handleFileChange"
								class="form-file-input"
						/>
						<p class="file-info" v-if="file">{{ file.name }} ({{ (file.size / 1024 / 1024).toFixed(2) }} MB)</p>
					</div>

					<div class="form-group">
						<label for="poster">Poster / Thumbnail</label>
						<input
								type="file"
								id="poster"
								@change="handlePosterChange"
								accept="image/*"
								class="form-file-input"
						/>
						<p class="file-info" v-if="poster">{{ poster.name }} ({{ (poster.size / 1024 / 1024).toFixed(2) }} MB)</p>
					</div>

					<div class="form-group">
						<label>Tags</label>
						<div v-if="loadingTags" class="loading">Chargement des tags...</div>
						<div v-else>
							<!-- Add new tag field -->
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
								</div>
								<div v-if="availableTags.length === 0" class="no-tags">
									Aucun tag disponible
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Progress Bar -->
			<div v-if="showProgress" class="upload-progress-container">
				<div class="progress-label">
					Upload en cours: {{ Math.round(uploadProgress) }}%
				</div>
				<div class="progress-bar-container">
					<div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
				</div>
			</div>

			<div class="form-actions">
				<button
						@click="router.push('/admin')"
						class="cancel-btn"
						:disabled="isUploading"
				>
					Annuler
				</button>
				<button
						@click="submitForm"
						class="submit-btn"
						:disabled="!isFormValid || isUploading"
				>
					<span v-if="isUploading">Upload en cours...</span>
					<span v-else>Ajouter le média</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
#description {
	height: 300px;
}
.add-media-container {
	padding: 20px;
	margin-top: 60px;
	color: white;
}

.page-title {
	text-align: center;
	margin-bottom: 30px;
	color: white;
}

.form-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	background-color: #2a2a2a;
	border-radius: 8px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* Two-column layout */
.form-columns {
	display: flex;
	gap: 30px;
	margin-bottom: 20px;
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
	height: calc(100% - 60px);
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
	transition: background-color 0.2s;
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

.tag-chip:hover {
	background-color: #444;
}

.no-tags {
	padding: 10px;
	color: #888;
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

.form-actions {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	margin-top: 30px;
}

.cancel-btn, .submit-btn {
	padding: 10px 20px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-weight: bold;
}

.cancel-btn {
	background-color: #555;
	color: white;
}

.submit-btn {
	background-color: #2ecc71;
	color: white;
}

.submit-btn:disabled {
	background-color: #555;
	cursor: not-allowed;
}

.error-message {
	margin-top: 20px;
	padding: 10px;
	background-color: rgba(231, 76, 60, 0.2);
	border-left: 4px solid #e74c3c;
	color: #e74c3c;
}

.loading {
	text-align: center;
	padding: 10px;
	color: #888;
}

@media (max-width: 768px) {
	.form-columns {
		flex-direction: column;
	}

	.form-actions {
		flex-direction: column;
	}

	.cancel-btn, .submit-btn {
		width: 100%;
	}
}
</style>