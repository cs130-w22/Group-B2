import { Dynamo } from "./Dynamo.js"

var docClient = null;

window.onload = async function() {
	//let removeButton = document.getElementById("removeButton");

	//removeButton.addEventListener("click", onClickRemove, false);

	docClient = new Dynamo();
    var userID = '1'
    const resp = await docClient.getTableEntry("UserInformation", "UserID", userID);
    queryEachProductAndGenerateList(resp.Item['Wishlist']);
}

function queryEachProductAndGenerateList(listOfItemInWishlist) {
    let divWishlist = document.getElementById("wishlist");
    let ulCatalogTag = createTag('ul', null, 'ulCatalog');
    listOfItemInWishlist.forEach(async function(productId) {
        const resp = await docClient.getTableEntry("ProductCatalog", "ProductID", productId);

        let liCatalogTag = createTag('li', null, 'idCatalog');
        let divproductRow = createTag('div', null, 'productRow');
        let divFirst = createTag('div', null, 'first-div');
        let divSecond = createTag('div', null, 'second-div');
        let divThird = createTag('div', null, 'third-div');
        let ulProductInfoTag = createTag('ul', null, 'productInfo');

        let info = ["Product: " + resp.Item['Product'], 
					"Seller: " + resp.Item['SellerName'], 
					"Location: " + resp.Item['Location'], 
					"Cost: " + resp.Item['Cost']];

        for (let i = 0; i < info.length; i++) {
            let liTag = createTag('li', null, "liStyle");
            liTag.innerHTML = info[i];
            ulProductInfoTag.appendChild(liTag);
        }

        let ahref = createTag('a', null, null);
		let imgTag = createTag('img', null, 'productImage');
		ahref.href = 'postdes.html?productid=' + productId;
		imgTag.src = "/img/chair.jpeg";
		ahref.appendChild(imgTag);

        let removeButton = createTag('button', null, 'removeButton');
        removeButton.type = 'button';
        removeButton.innerHTML = 'Remove';
        removeButton.addEventListener("click", onClickRemove, false);
        removeButton.productId = productId;
        removeButton.productName = resp.Item['Product'];

        divFirst.appendChild(ahref);
        divSecond.appendChild(ulProductInfoTag);
        divThird.appendChild(removeButton);

        divproductRow.appendChild(divFirst);
        divproductRow.appendChild(divSecond);
        divproductRow.appendChild(divThird);

        liCatalogTag.appendChild(divproductRow);
        ulCatalogTag.appendChild(liCatalogTag);
    });
    divWishlist.appendChild(ulCatalogTag);
}

function onClickRemove(evt) {
    let confirmed = window.confirm("Remove product \"" + evt.currentTarget.productName + "\" from your wishlist?");
    if (confirmed) {
        window.alert("Removing ID: " + evt.currentTarget.productId);
    } else {
        window.alert("Not removing ID: " + evt.currentTarget.productId);
    }
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