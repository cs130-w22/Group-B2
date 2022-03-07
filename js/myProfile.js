/**
 * @file profile page logic 
 */
import { Dynamo } from "./Dynamo.js"
import { S3Bucket } from "./S3Bucket.js"
import * as utilities from './utils.js'
import * as cookie from './cookie.js'
import * as Catalog from "./catalog.js"
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

/**
 * User ID
 * @type {String}
 */
var userID = cookie.getCookie("UserID");

window.onload = function(){
    if (userID == "") {
		window.alert("You are not logged in. Redirecting to login page.");
		window.location.href = "./loginPage.html";
	}
    let logoutButton = document.getElementById("logout");
    let uploadButton = document.getElementById("submit");

    logoutButton.addEventListener("click", utilities.logout, false);
    uploadButton.addEventListener("click", getPresignedAndUpload, false);

    docClientS3 = new S3Bucket(); 
    docClientDynamo = new Dynamo();
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
 * API call to generate S3 presigned URL and upload file using PUT request
 * @param {String} directory Directory to add file to S3
 * @param {File} image Image file of product
 * @returns Object[]
 */
 async function getPresignedAndUpload() {
    var image = document.getElementById("myFile").files[0];
    if (image == undefined) {
        window.alert("Please upload an image file.");
    } else {
        var userImg = crypto.randomBytes(10).toString('hex');
        const url = await docClientS3.generateURL(userImg);
        console.log(url);
        const resp = await fetch(url, {
            method: "PUT",
            headers: {
               "Content-Type": "multipart/form-data"
            },
            body: image
        });
    
        const img = url.split('?')[0];
        
        const respDynamoUpdate = await docClientDynamo.updateTableEntry("UserInformation", userID, "ImageProfile", img);
        if (respDynamoUpdate['$response']['httpResponse']['statusCode'] == 200) {
            window.alert("Uploaded profile image!");
            const response = getUserInfo(userID);
            response.then(result => populateUserData(result));
        } else {
            window.alert("Something went wrong");
        }
    }
}

/**
 * Removes product information from a user's profile in the database 
 * @param {String} productID Product ID
 * @param {Boolean} bought signifies if the item has been purhcased
 * @returns void
 */
async function removePostFromTable(productID, bought){
    console.log("delete post requested")
    const respDyanmoGetUserEntry = await docClientDynamo.getTableEntry('UserInformation', userID);
    const userSellingProductIDList = respDyanmoGetUserEntry.Item['ListofProductIDSelling']

    let newUserSellingProductIDList = []
    for(let i = 0; i < userSellingProductIDList.length; i++){
        if(userSellingProductIDList[i] != productID)
        arrayAppend(newUserSellingProductIDList, userSellingProductIDList[i])
    }

    const respDynamoRemoveProductToUserSelling = await docClientDynamo.updateTableEntry('UserInformation', userID, 'ListofProductIDSelling', newUserSellingProductIDList);
    const respDynamoDeleteProductFromCatalog = await docClientDynamo.deleteProductTableEntry(productID);

    //removeFromWishlists(productID)
    if(bought){
    const userSoldProductIDList = arrayAppend(respDyanmoGetUserEntry.Item['ListofProductIDSold'], productID);
    const respDynamoAddProductToUserSoldList = await docClientDynamo.updateTableEntry('UserInformation', userID, 'ListofProductIDSold', userSoldProductIDList);
        
        if (respDynamoRemoveProductToUserSelling['$response']['httpResponse']['statusCode'] == 200 &&
            respDynamoAddProductToUserSoldList['$response']['httpResponse']['statusCode'] == 200 &&
            respDynamoDeleteProductFromCatalog['$response']['httpResponse']['statusCode'] == 200) {
            window.alert("Successfully purchased!");
            window.location.href = "./myprofile.html"
        } else {
            window.alert("Something went wrong...\n");
        }
    } else {
        if (respDynamoRemoveProductToUserSelling['$response']['httpResponse']['statusCode'] == 200 &&
            respDynamoDeleteProductFromCatalog['$response']['httpResponse']['statusCode'] == 200) {
            window.alert("Post successfully removed");
            window.location.href = "./myprofile.html"
        } else {
            window.alert("Something went wrong...\n");
        }
    }

    
     
}

// /**
//  * Removes product from every user wishlist that has it 
//  * @param {String} productID Product ID
//  * @returns void
//  */
// async function removeFromWishlists(productID){
//     const respWishListLookUp = await docClientDynamo.getTableEntry('Wishlist', productID)
//     const usersWithProductInWishlist = respWishListLookUp.Item['ListOfUsers']
//     for(let i = 0; i < usersWithProductInWishlist.length; i++){
//         if(!removeFromSingleWishlist(usersWithProductInWishlist[i], productID)){
//             window.alert("error removing from a wishlist")
//         }
//     }
//     if (respWishListLookUp['$response']['httpResponse']['statusCode'] != 200){
//         window.alert("error finding item in wishlist table")
//     }
// }

// /**
//  * Removes product from a specific user ID's wishlist 
//  * @param {String} userID user id 
//  * @param {String} productID Product ID
//  * @returns Boolean
//  */
// async function removeFromSingleWishlist(userID, productID){
//     const respDyanmoGetUserEntry = await docClientDynamo.getTableEntry('UserInformation', userID);
//     const wishlistItems = respDyanmoGetUserEntry.Item['Wishlist']
//     let updatedWishlist = []
//     for(let i = 0; i < wishlistItems.length; i++){
//         if(wishlistItems[i] != productID)
//         arrayAppend(updatedWishlist, wishlistItems[i])
//     }
//     const respDynamoUpdatedWishlist = await docClientDynamo.updateTableEntry('UserInformation', userID, 'Wishlist', updatedWishlist);
//     if (respDynamoUpdatedWishlist['$response']['httpResponse']['statusCode'] == 200){
//         return true;
//     }
//     return false;
// }

/**
 * Gets user information from a user's profile in the database 
 * @param {String} userID Seller's User ID
 * @returns Promise
 */
async function getUserInfo(userID){
    const entry = await docClientDynamo.getTableEntry("UserInformation", userID);
    return entry;
}

/**
 * Create tags to display user information in profile
 * @param {Promise} result
 * @returns void
 */
async function populateUserData(result) {
    let userInfoSquare = document.getElementById("userInfoSquare");
    let imageProfile = document.getElementById("profileImg");
    userInfoSquare.innerHTML = '';
    
    if (result.Item["ImageProfile"] == undefined) {
        imageProfile.src = "../img/profile_picture.jpg";
    } else {
        imageProfile.src = result.Item["ImageProfile"];
    }
    
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
 * Display posts of current user of items available for sale, uses helper function from catalog
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
    Catalog.updateTable(divPostsSquare, product_list, true);

    for(let i = 0; i < listOfProductIDs.length; i++){
        const classElems = document.getElementsByClassName(listOfProductIDs[i]);
        for(let j = 0; j < classElems.length; j++){
            classElems[j].addEventListener('click', function () {
                removePostFromTable(listOfProductIDs[i], false);
            })
        }
    }

 }

