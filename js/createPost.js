/**
 * @file Create post logic file
 */
import { Dynamo } from "./Dynamo.js"
import { S3Bucket } from "./S3Bucket.js"
import * as cookie from './cookie.js'
import * as utils from './utils.js'
var crypto = require("crypto");

/**
 * S3 Object
 * @type {S3}
 */
var docClientS3 = null;
/**
 * Dynamo Object
 * @type {Dynamo}
 */
var docClientDynamo = null;

var userID = cookie.getCookie("UserID");

window.onload = function() {
    if (userID == "") {
		window.alert("You are not logged in. Redirecting to login page.");
		window.location.href = "./loginPage.html";
	}
    let createPostButton = document.getElementById("submit");
    let logoutButton = document.getElementById("logout");

    createPostButton.addEventListener("click", validatePostCreation, false);
    logoutButton.addEventListener("click", utils.logout, false);

    docClientS3 = new S3Bucket();
    docClientDynamo = new Dynamo();
}

/**
 * Validate all input fields when create post button is clicked
 * @returns void
 */
function validatePostCreation() {
    var itemName = document.getElementById("item_name").value;
    var itemCost = document.getElementById("item_cost").value;
    var itemDescription = document.getElementById("item_description").value;
    var itemCategory = document.getElementById("category").value;
    var address = document.getElementById("address").value;
    var image = document.getElementById("myFile").files[0];

    var cost = new RegExp('([0-9])+\.?([0-9])*');

    if (itemName == "") {
        alert("please enter item name");
        return false;
    }

    if (!cost.test(itemCost)) {
        alert("please enter valid item cost");
        return false;
    } else {
        if (!(itemCost.indexOf('.') == itemCost.length - 3 || itemCost.indexOf('.') == itemCost.length - 2 || itemCost.indexOf('.') == -1)) {
            alert("please enter valid item cost");
            return false;
        }
    }

    if (itemDescription == "") {
        alert("item description is required");
        return false;
    }

    if (image == "") {
        alert("must upload product image");
        return false;
    }

    var productID = generateID(5);
    var imageID = generateID(5);
    doCreatePostTask(productID, imageID, itemDescription, address, image, itemCost, itemName, itemCategory, userID);
}

/**
 * Adds all infomation to the database when creating a product post
 * @param {String} productID Product ID
 * @param {String} imageID Image ID
 * @param {String} address Address location of the product
 * @param {File} image Image file of the product
 * @param {String} itemCost Cost of the product
 * @param {String} itemName Name of the product
 * @param {String} itemCategory Category product
 * @param {String} userID Seller's User ID
 * @returns void
 */
async function doCreatePostTask(productID, imageID, itemDescription, address, image, itemCost, itemName, itemCategory, userID) {
    const respDyanmoGetUserEntry = await docClientDynamo.getTableEntry('UserInformation', userID);
    const userName = respDyanmoGetUserEntry.Item['FirstName'] + ' ' + respDyanmoGetUserEntry.Item['LastName'];
    const respS3 = await getPresignedAndUpload(productID + "/" + imageID, image);
    const respDynamoAddProductToCatalog = await docClientDynamo.putProductTableEntry(productID, itemCost, itemDescription, address, itemName, respS3[1], imageID, itemCategory, userName, userID);
    const respDynamoWishlist = await docClientDynamo.putProductWishlistWatchEntry(productID);
    const newProductSellingList = utils.arrayAppend(respDyanmoGetUserEntry.Item['ListofProductIDSelling'], productID);
    const respDynamoAddProductToUser = await docClientDynamo.updateTableEntry('UserInformation', userID, 'ListofProductIDSelling', newProductSellingList);
    
    console.log(respDynamoWishlist);
    if (respDynamoAddProductToCatalog['$response']['httpResponse']['statusCode'] == 200 && 
        respDynamoWishlist['$response']['httpResponse']['statusCode'] == 200 && 
        respDynamoAddProductToUser['$response']['httpResponse']['statusCode'] == 200 &&
        respS3[0]['status'] == 200) {
        window.alert("Post uploaded! Check the catalog to see your post!");
    } else {
        window.alert("Something went wrong...\n" + 
        "Dynamo Status: " + respDynamo['$response']['httpResponse']['statusCode'] + "\n" + 
        "S3 Status: " + respS3[0]['status']);
    }
}

/**
 * API call to generate S3 presigned URL and upload file using PUT request
 * @param {String} directory Directory to add file to S3
 * @param {File} image Image file of product
 * @returns Object[]
 */
async function getPresignedAndUpload(directory, image) {
    const url = await docClientS3.generateURL(directory);
    const resp = await fetch(url, {
        method: "PUT",
        headers: {
           "Content-Type": "multipart/form-data"
        },
        body: image
    });

    const img = url.split('?')[0];
    return [resp, img];
}

/**
 * Generate an ID given length
 * @param {Number} length Length of ID
 * @returns String
 */
function generateID(length) {
    return crypto.randomBytes(length).toString('hex');
}