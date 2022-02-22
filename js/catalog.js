import { Dynamo } from "./Dynamo.js"

var docClient = null;

window.onload = function() {
	let filterButton = document.getElementById("filterButton");

	filterButton.addEventListener("click", onClickFilter, false);

	docClient = new Dynamo();
	console.log(window.location);
}

async function onClickFilter() {
	var productType = document.getElementById("items");
	if (productType.value != "SELECT") {
		let divCatalog = document.getElementById("divCatalog");
		var divLoading = document.getElementById("divLoading");

		divCatalog.innerHTML = '';
		divLoading.style.visibility = 'visible';

		const resp = await docClient.queryTable("ProductCatalog", "ProductType-index", "ProductType", productType.value);
		console.log(resp)
		divLoading.style.visibility = 'hidden';
		updateTable(divCatalog, resp.Items);
	}
}

function updateTable(divCatalog, listOfProducts) {
	let ulCatalogTag = createTag('ul', null, 'ulCatalog');

	divCatalog.innerHTML = '';
	listOfProducts.forEach(function(item) {
		let liCatalogTag = createTag('li', null, 'idCatalog');
		let divCatalogTag = createTag('div', null, 'divCatalog');
		let divLeftTag = createTag('div', null, 'left');
		let divRightTag = createTag('div', null, 'right');
		let ulProductInfoTag = createTag('ul', null, 'productInfo');

		let info = ["Product: " + item['Product'], 
					"Seller: " + item['SellerName'], 
					"Location: " + item['Location'], 
					"Cost: " + item['Cost']]

		for (let i = 0; i < info.length; i++) {
			let liTag = createTag('li', null, "liStyle");
			liTag.innerHTML = info[i];
			ulProductInfoTag.appendChild(liTag);
		}

		let ahref = createTag('a', null, null);
		let imgTag = createTag('img', null, 'productImage');
		ahref.href = 'postdes.html?productid=' + item['ProductID'];
		imgTag.src = "/img/chair.jpeg";
		ahref.appendChild(imgTag);
		divLeftTag.appendChild(ahref);
		divRightTag.appendChild(ulProductInfoTag);

		divCatalogTag.appendChild(divLeftTag);
		divCatalogTag.appendChild(divRightTag);

		liCatalogTag.appendChild(divCatalogTag);

		ulCatalogTag.appendChild(liCatalogTag);
	});

	divCatalog.appendChild(ulCatalogTag);
	divCatalog.style.visibility = 'visible';
}

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