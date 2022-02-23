import { Dynamo } from "./Dynamo.js"

var docClient = null;

window.onload = function() {
	docClient = new Dynamo();
    refresh();
}

async function refresh() {
    var userID = '2'
    const resp = await docClient.getTableEntry("UserInformation", "UserID", userID);
    queryEachProductAndGenerateList(userID, resp.Item['Wishlist']);
}

function queryEachProductAndGenerateList(userID, listOfItemInWishlist) {
    let divWishlist = document.getElementById("wishlist");
    let ulCatalogTag = createTag('ul', null, 'ulCatalog');

    divWishlist.innerHTML = '';
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
        removeButton.params = [userID, productId, resp.Item['Product'], listOfItemInWishlist]

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

async function onClickRemove(evt) {
    let userID = evt.currentTarget.params[0];
    let productId = evt.currentTarget.params[1];
    let productName = evt.currentTarget.params[2];
    let wishlist = evt.currentTarget.params[3];

    let confirmed = window.confirm("Remove product \"" + productName + "\" (ID=" + productId + ") from your wishlist?");
    if (confirmed) {
        const index = wishlist.indexOf(productId);
        wishlist.splice(index, 1);
        const resp = await docClient.updateTableEntry("UserInformation", userID, wishlist);
        let status = resp['$response']['httpResponse']['statusCode'];
        if (status == 200) {
            window.alert("Successfully removed \"" + productName + "\" (ID=" + productId + ").");
            refresh();
        } else {
            window.alert("Unexpected error happened... (status=" + status + ").");
        }
    } else {
        window.alert("Not removing \"" + productName + "\" (ID=" + productId + ").");
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