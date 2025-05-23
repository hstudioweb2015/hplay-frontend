import Media from "@/libs/Media.js";
import User from "@/libs/User.js";

export default class ApiService {
	
	static async login(email, password) {
		const url = `/v1/user/login`;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {email, password},
		};
		return await ApiService.fetchData(url, options);
	}

	static async register(firstName, lastName, email, password) {
		const url = `/v1/user/register`;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {firstName, lastName, email, password},
		};
		return await ApiService.fetchData(url, options);
	}
	
	static async searchUsers(query = '') {
		const url = `/v1/user/search`;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				query: query
			}
		};
		let response = await ApiService.fetchData(url, options);
		return response.map(user => Object.assign(new User(), user));
	}
	
	static async updateUser(user) {
		const url = `/v1/user/${user.id}`;
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: user,
		};
		return await ApiService.fetchData(url, options);
	}
	
	static async resetUserPassword(userId) {
		const url = `/v1/user/${userId}/reset-password`;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		return await ApiService.fetchData(url, options);
	}
	
	static async deleteUser(userId) {
		const url = `/v1/user/${userId}`;
		const options = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		return await ApiService.fetchData(url, options);
	}
	
	static async verifyToken() {
		const url = `/v1/user/verify-token`;
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		return await ApiService.fetchData(url, options);
	}
	
	static async searchMedias(params) {
		const url = `/v1/media/search`;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: params
		};
		let response = await ApiService.fetchData(url, options);
		response = response.medias.map(media => Object.assign(new Media(), media));
		return response;
	}
	
	static async createMedia(media) {
		const url = `/v1/media`;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: media,
		};
		let response = await ApiService.fetchData(url, options);
		response = Object.assign(new Media(), response);
		return response;
	}

	// In ApiService.js - replace both uploadMediaFile methods with this single implementation
	static async uploadMediaFile(mediaId, file, progressCallback) {
		const url = `/v1/media/${mediaId}/upload`;
		const formData = new FormData();
		formData.append('file', file);

		if (!progressCallback) {
			// Use standard fetch if no progress tracking needed
			const options = {
				method: 'POST',
				headers: {
					'Authorization': localStorage.getItem('jwtToken') ? `Bearer ${localStorage.getItem('jwtToken')}` : '',
				},
				body: formData,
			};
			const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, options);
			if (!response.ok) {
				throw new Error(`Error: ${response.status} ${response.statusText}`);
			}
			return response.json();
		}

		// Use XMLHttpRequest with progress tracking
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', (event) => {
				if (event.lengthComputable) {
					const percentComplete = (event.loaded / event.total) * 100;
					progressCallback(percentComplete);
				}
			});

			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(JSON.parse(xhr.responseText));
				} else {
					reject(xhr.statusText);
				}
			};

			xhr.onerror = () => reject(xhr.statusText);

			xhr.open('POST', `${import.meta.env.VITE_API_URL}${url}`, true);
			xhr.setRequestHeader('Authorization', localStorage.getItem('jwtToken') ?
					`Bearer ${localStorage.getItem('jwtToken')}` : '');
			xhr.send(formData);
		});
	}
	
	static async updateMedia(media) {
		const url = `/v1/media/${media.id}`;
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: media,
		};
		let response = await ApiService.fetchData(url, options);
		response = Object.assign(new Media(), response);
		return response;
	}

	static async uploadThumbnail(mediaId, file, progressCallback) {
		const url = `/v1/media/${mediaId}/thumbnail`;
		const formData = new FormData();
		formData.append('file', file);

		if (!progressCallback) {
			// Use standard fetch if no progress tracking needed
			const options = {
				method: 'POST',
				headers: {
					'Authorization': localStorage.getItem('jwtToken') ? `Bearer ${localStorage.getItem('jwtToken')}` : '',
				},
				body: formData,
			};
			const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, options);
			if (!response.ok) {
				throw new Error(`Error: ${response.status} ${response.statusText}`);
			}
			return response.json();
		}

		// Use XMLHttpRequest with progress tracking
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', (event) => {
				if (event.lengthComputable) {
					const percentComplete = (event.loaded / event.total) * 100;
					progressCallback(percentComplete);
				}
			});

			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(JSON.parse(xhr.responseText));
				} else {
					reject(xhr.statusText);
				}
			};

			xhr.onerror = () => reject(xhr.statusText);

			xhr.open('POST', `${import.meta.env.VITE_API_URL}${url}`, true);
			xhr.setRequestHeader('Authorization', localStorage.getItem('jwtToken') ?
					`Bearer ${localStorage.getItem('jwtToken')}` : '');
			xhr.send(formData);
		});
	}
	
	static async deleteMedia(mediaId) {
		const url = `/v1/media/${mediaId}`;
		const options = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		await ApiService.fetchData(url, options);
	}
	
	static async getMedia(id) {
		const url = `/v1/media/${id}`;
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		let response = await ApiService.fetchData(url, options);
		response = Object.assign(new Media(), response);
		return response;
	}
	
	static async playMedia(id) {
		const url = `/v1/media/${id}/play`;
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		let response = await ApiService.fetchData(url, options);
		return response.url;
	}
	
	static async getAllTags() {
		const url = `/v1/tag`;
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		return await ApiService.fetchData(url, options);
	}
	
	static async createTag(tag) {
		const url = `/v1/tag`;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				name: tag
			}
		};
		return await ApiService.fetchData(url, options);
	}
	
	static async updateTag(id, tag) {
		const url = `/v1/tag/${id}`;
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				name: tag
			}
		};
		return await ApiService.fetchData(url, options);
	}
	
	static async deleteTag(id) {
		const url = `/v1/tag/${id}`;
		const options = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		return await ApiService.fetchData(url, options);
	}
	
	static async getPaymentUrl(params) {
		const url = `/v1/payment`;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: params
		};
		return (await ApiService.fetchData(url, options)).url;
	}
	
	/**
	 * Fetch data from the API
	 * @param endpoint {string} - The API endpoint to fetch data from
	 * @param method {string} - The HTTP method to use (GET, POST, PUT, DELETE)
	 * @param body {object} - The request body (for POST and PUT requests)
	 * @param headers {object} - Additional headers to include in the request
	 * @returns {Promise<any>} - The response data from the API
	 */
	static async fetchData(endpoint, {method = 'GET', body = null, headers = {}}) {
		const url = `${import.meta.env.VITE_API_URL}${endpoint}`;
		let options = {
			method,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.getItem('jwtToken') ? `Bearer ${localStorage.getItem('jwtToken')}` : '',
				...headers,
			},
		};
		if (body) {
			options.body = typeof body === 'object' ? JSON.stringify(body) : body;
		}

		const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}
		
		return response.json();
	}
}