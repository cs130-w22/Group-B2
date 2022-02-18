import { Dynamo } from "./Dynamo.js"

var docClient = null;

window.onload = function() {
	let filterButton = document.getElementById("filterButton");

	filterButton.addEventListener("click", onClickFilter, false);

	docClient = new Dynamo();
}

async function onClickFilter() {
	var productType = document.getElementById("items");
	let divCatalog = document.getElementById("divCatalog");
	var divLoading = document.getElementById("divLoading");

	divCatalog.innerHTML = '';
	divLoading.style.visibility = 'visible';

	const resp = await docClient.queryTable("ProductCatalog", "ProductType-index", "ProductType", productType.value);

	divLoading.style.visibility = 'hidden';
	updateTable(divCatalog, resp.Items);
}

function updateTable(divCatalog, listOfProducts) {
	let ulTagItem = createTag('ul', null, 'itemList');

	divCatalog.innerHTML = '';
	listOfProducts.forEach(function(item) {
		console.log(item);
		let leftTag = createTag('div', 'left', null);
		let rightTag = createTag('div', 'right', null);
		let liTag = createTag('li', 'split', null);
		let imgTag = createTag('img', null, 'img');
		let ulTagInfo = createTag('ul', 'infoList', null);

		let info = ["Product: " + item['Product'], 
					"Seller: " + item['Seller Name'], 
					"Location: " + item['Location'], 
					"Cost: " + item['Cost']]
		console.log(info);

		for (let i = 0; i < info.length; i++) {
			let liTag = createTag('li', null, null);
			liTag.innerHTML = info[i];
			ulTagInfo.appendChild(liTag);
		}

		let ahref = createTag('a', null, null);
		ahref.href = '#';
		imgTag.src = "img/chair.jpeg";
		ahref.appendChild(imgTag);
		leftTag.appendChild(ahref);
		rightTag.appendChild(ulTagInfo);

		liTag.appendChild(leftTag);
		liTag.appendChild(rightTag);

		ulTagItem.appendChild(liTag);
	});

	divCatalog.appendChild(ulTagItem);
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