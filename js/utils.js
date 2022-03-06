import * as cookie from './cookie.js'

/**
 * Logs out by deleting cookies
 * @returns void
 */
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

/**
 * Append val to lst and return the new list with removed empty and null values
 * @param {Object[]} lst 
 * @param {Object} val 
 * @returns Object[]
 */
export function arrayAppend(lst, val) {
    lst.push(val);
    return lst.filter(item => item);
}