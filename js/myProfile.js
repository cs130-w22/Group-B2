/**
 * @file profile page logic 
 */
import { utils } from "hash.js";
import { Dynamo } from "./Dynamo.js"
import { S3Bucket } from "./S3Bucket.js"
import * as utilities from './utils.js'
import * as cookie from './cookie.js'
import * as Catalog from "./catalog.js"

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

//var id = "a6079e34ec";
//var id = "22905ee334";

window.onload = function(){
    if (userID == "") {
		window.alert("You are not logged in. Redirecting to login page.");
		window.location.href = "./loginPage.html";
	}
    docClientDynamo = new Dynamo(); 
    docClientS3 = new S3Bucket(); 
    const response = getUserInfo(userID);
    response.then(result => populateUserData(result));
} 

/**
 * Append val to lst and return the new list with removed empty and null values
 * @param {Object[]} lst 
 * @param {Object} val 
 * @returns Object[]
 */
function arrayAppend(lst, val) {
    lst.push(val);
    return lst.filter(item => item);
}

/**
 * Removes product information from a user's profile in the database 
 * @param {String} productID Product ID
 * @param {String} userID Seller's User ID
 * @returns void
 */
async function removePostFromTable(userID, productID){
    const respDyanmoGetUserEntry = await docClientDynamo.getTableEntry('UserInformation', 'UserID', userID);
    const userSellingProductIDList = respDyanmoGetUserEntry.Item['ListofProductIDSelling']
    const indexOfProduct = indexOf(userSellingProductIDList, productID); 
    newProductSellingList; 
    if(indexOfProduct > -1){
        newProductSellingList = userSellingProductIDList.splice(indexOfProduct, 1);
    } else {
        newProductSellingList = userSellingProductIDList
    }
    const respDynamoRemoveProductToUserSelling = await docClientDynamo.updateTableEntry('UserInformation', userID, 'ListofProductIDSelling', newProductSellingList);
    const userSoldProductIDList = arrayAppend(respDyanmoGetUserEntry.Item['ListofProductIDSold'], productID);
    const respDynamoAddProductToUserSoldList = await docClientDynamo.updateTableEntry('UserInformation', userID, 'ListofProductIDSold', userSoldProductIDList);

    const respDynamoDeleteProductFromCatalog = await docClientDynamo.deleteProductTableEntry(productID); 

    if (respDynamoRemoveProductToUserSelling['$response']['httpResponse']['statusCode'] == 200 &&
        respDynamoAddProductToUserSoldList['$response']['httpResponse']['statusCode'] == 200 &&
        respDynamoDeleteProductFromCatalog['$response']['httpResponse']['statusCode'] == 200) {
        window.alert("Post successfully removed");
    } else {
        window.alert("Something went wrong...\n");
    }
     
}


async function getUserInfo(userID){
    const entry = await docClientDynamo.getTableEntry("UserInformation", userID);
    return entry;
}

async function populateUserData(result) {
    result.Item.Address
    let userInfoSquare = document.getElementById("userInfoSquare");
    
    let p  = utilities.createTag('p', null, null);
    let p2 = utilities.createTag('p', null, null);
    let p3 = utilities.createTag('p', null, null);
    let p4 = utilities.createTag('p', null, null);
    
    let user_fullname = document.createTextNode(result.Item.FirstName + " " + result.Item.LastName);
    let user_email = document.createTextNode(result.Item.Email);
    let user_phone = document.createTextNode(result.Item.PhoneNumber);
    
    p.appendChild(user_fullname);
    userInfoSquare.appendChild(p);
    p3.appendChild(user_email);
    userInfoSquare.appendChild(p3);
    p4.appendChild(user_phone);
    userInfoSquare.appendChild(p4);

    let postsSquare = document.getElementById("postsSquare");
    await displayPosts(postsSquare, result.Item.ListofProductIDSelling);
}

/**
 * Update table helper function
 * @param {Object} divPostsSquare Div tag to update table
 * @param {Object[]} listOfProducts List of all queried products from Dynamo DB
 * @returns void
 */
 async function displayPosts(divPostsSquare, listOfProductIDs) {

    let product_list = [];
	
    for (let i = 0; i < listOfProductIDs.length; i++){
        let product =  await docClientDynamo.getTableEntry('ProductCatalog', listOfProductIDs[i]);
        product_list.push(product.Item);
        
	}
    //console.log(product_list)
    Catalog.updateTable(divPostsSquare, product_list)

 }

