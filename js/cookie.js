/**
 * Get cookie give name
 * @param {String} cname Cookie name
 * @returns void
 */
export function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
}

/**
 * Set cookie for a certain amount of day(s) with given name
 * @param {String} userID Cookie name
 * @param {int} exdays Number of days before expiring 
 */
export function setCookie(userID, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie =  "UserID=" + userID + ";" + expires + ";path=/";
}

/**
 * Delete all cookies by setting expiration date to the very earliest
 * @returns void
 */
export function deleteCookie() {
    let userID = getCookie("UserID");
    document.cookie = "UserID=" + userID + ";" + "expires=Thu, 18 Dec 2013 12:00:00 UTC;path=/";
}