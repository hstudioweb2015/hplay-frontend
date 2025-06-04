export default class User {

	/**
	 * User constructor
	 * @param id {number}
	 * @param firstName {string}
	 * @param lastName {string}
	 * @param email {string}
	 * @param isAdmin {boolean}
	 */
	constructor(id, firstName, lastName, email, isAdmin) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.isAdmin = isAdmin;
	}
}