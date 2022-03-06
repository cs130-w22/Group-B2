/**
 * @file Catalog logic file
 */
import { Dynamo } from "./Dynamo.js"
import * as cookie from './cookie.js'
import * as utils from './utils.js'

/**
 * Dynamo Object
 * @type {Dynamo}
 */
var docClient = null;

window.onload = function() {
	var userID = cookie.getCookie("UserID");
	userID = "48605a7a85"
	console.log(userID);
	if (userID == "") {
		window.alert("You are not logged in. Redirecting to login page.");
		window.location.href = "./loginPage.html";
	}
	let filterButton = document.getElementById("filterButton");
	let logoutButton = document.getElementById("logout");

	filterButton.addEventListener("click", onClickFilter, false);
	logoutButton.addEventListener("click", utils.logout, false);

	docClient = new Dynamo();
}
/**
 * Filter function call logic
 * @returns void
 */
async function onClickFilter() {
	var productType = document.getElementById("items");
	if (productType.value != "SELECT") {
		let divCatalog = document.getElementById("divCatalog");
		var divLoading = document.getElementById("divLoading");

		divCatalog.innerHTML = '';
		divLoading.style.visibility = 'visible';

		const resp = await docClient.queryTable("ProductCatalog", "ProductType-index", "ProductType", productType.value);
		divLoading.style.visibility = 'hidden';
		updateTable(divCatalog, resp.Items, false);
	}
}

/**
 * Update table helper function
 * @param {Object} divCatalog Div tag to update table
 * @param {Object[]} listOfProducts List of all queried products from Dynamo DB
 * @returns void
 */
export function updateTable(divCatalog, listOfProducts, isOwner) {
	let ulCatalogTag = utils.createTag('ul', null, 'ulCatalog');

	divCatalog.innerHTML = '';
	listOfProducts.forEach(function(item) {
		if (item['IsBought'] == "No") {
			let liCatalogTag = utils.createTag('li', null, 'idCatalog');
			let divCatalogTag = utils.createTag('div', null, 'divCatalog');
			let divLeftTag = utils.createTag('div', null, 'left');
			let divRightTag = utils.createTag('div', null, 'right');
			let ulProductInfoTag = utils.createTag('ul', null, 'productInfo');


			let style = isOwner ? "liStyle2" : "liStyle"; 
			let info = ["Product: " + item['Product'],
			"Seller: " + item['SellerName'],
			"Location: " + item['Location'],
			"Cost: " + item['Cost']];
			
			for (let i = 0; i < info.length; i++) {
				let liTag = utils.createTag('li', null, style);
				liTag.innerHTML = info[i];
				ulProductInfoTag.appendChild(liTag);
			}

			if(isOwner){
				info.push(["Delete item"]);
				let liTag = utils.createTag("li", null, "liStyle3");
				liTag.innerHTML = info[info.length - 1];
				liTag.className = item['ProductID']
				ulProductInfoTag.appendChild(liTag);
			}

			let ahref = utils.createTag('a', null, null);
			let imgTag = utils.createTag('img', null, 'productImage');
			ahref.href = 'postdes.html?productid=' + item['ProductID'];
			imgTag.src = item['ImageUrl'];
			ahref.appendChild(imgTag);
			divLeftTag.appendChild(ahref);
			divRightTag.appendChild(ulProductInfoTag);

			divCatalogTag.appendChild(divLeftTag);
			divCatalogTag.appendChild(divRightTag);

			liCatalogTag.appendChild(divCatalogTag);

			ulCatalogTag.appendChild(liCatalogTag);
		}
	});

	divCatalog.appendChild(ulCatalogTag);
	divCatalog.style.visibility = 'visible';
}