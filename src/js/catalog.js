var AWS = require("aws-sdk");
var dotenv = require("dotenv");

require("dotenv").config();

AWS.config.update({
	region: process.env.REGION,
	accessKeyId: process.env.ACCESS_ID,
    secretAccessKey: process.env.ACCESS_KEY,
	endpoint: process.env.ENDPOINT
});

var docClient = new AWS.DynamoDB.DocumentClient();

window.onload = function() {
	let filterButton = document.getElementById("filterButton");

	filterButton.addEventListener("click", onClickFilter, false);
}

async function onClickFilter() {
	var productType = document.getElementById("items");
	let divCatalog = document.getElementById("divCatalog");
	var divLoading = document.getElementById("divLoading");
	var params = makeFilterParam(productType.value);

	try {
		divCatalog.innerHTML = '';
		divLoading.style.visibility = 'visible';

		const resp = await docClient.query(params).promise();
		console.log("Query succeeded.");

		divLoading.style.visibility = 'hidden';
		updateTable(divCatalog, resp.Items);
	} catch (err) {
		console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
	}
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

		imgTag.src = "img/chair.jpeg";
		leftTag.appendChild(imgTag);
		rightTag.appendChild(ulTagInfo);

		liTag.appendChild(leftTag);
		liTag.appendChild(rightTag);

		ulTagItem.appendChild(liTag);
	});

	console.log(ulTagItem);
	divCatalog.appendChild(ulTagItem);
	divCatalog.style.visibility = 'visible';
}

function createTag(tagName, className, idName) {
	var tag = document.createElement(tagName);
	if (className != null) {
		tag.className = className;
	}
	if (idName != null) {
		tag.id = idName;
	}
	return tag;
}

function makeFilterParam(productType) {
	let params = {
		TableName : "ProductCatalog",
		IndexName: "ProductType-index",
		KeyConditionExpression: "#pt = :pt",
		ExpressionAttributeNames:{
			"#pt": "ProductType"
		},
		ExpressionAttributeValues: {
			":pt": productType
		}
	};

	return params;
}