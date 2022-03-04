import * as cookie from './cookie.js'

export function logout() {
	cookie.deleteCookie();
	window.location.href = "./loginPage.html";
}

/**
 * Create tag helper function
 * @param {String} tagName Tag name
 * @param {String} className Class name for tag
 * @param {String} idName ID name for tag
 * @returns Element
 */
 export function createTag(tagName, className, idName) {
	var tag = document.createElement(tagName);
	if (className != null) {
		tag.className = className;
	}
	if (idName != null) {
		tag.id = idName;
	}
	return tag;
}