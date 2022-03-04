/**
 * @file profile page logic 
 */
import { utils } from "hash.js";
import { Dynamo } from "./Dynamo.js"
import { S3Bucket } from "./S3Bucket.js"
import * as utilities from './utils.js'


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

var id = "a6079e34ec";



window.onload = function(){
    docClientDynamo = new Dynamo(); 
    docClientS3 = new S3Bucket(); 
    const response = getUserInfo(id);
    console.log(response);
    console.log("hi");
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

function populateUserData(result) {
    result.Item.Address
    let userInfoSquare = document.getElementById("userInfoSquare");
    let userNameSquare = document.getElementById("userNameSquare");

    let h2 = utilities.createTag('h', null, null);
    let p  = utilities.createTag('p', null, null);
    let p2 = utilities.createTag('p', null, null);
    let p3 = utilities.createTag('p', null, null);
    let p4 = utilities.createTag('p', null, null);
    

    let user_firstname = document.createTextNode(result.Item.FirstName);
    let user_lastname = document.createTextNode(result.Item.LastName);
    let user_email = document.createTextNode(result.Item.Email);
    let user_phone = document.createTextNode(result.Item.PhoneNumber);
    
    h2.appendChild(user_firstname);
    userNameSquare.appendChild(h2);

    p.appendChild(user_firstname);
    userInfoSquare.appendChild(p);
    p2.appendChild(user_lastname);
    userInfoSquare.appendChild(p2);
    p3.appendChild(user_email);
    userInfoSquare.appendChild(p3);
    p4.appendChild(user_phone);
    userInfoSquare.appendChild(p4);


    //For tag/posts purposes
    let user_selling_list = document.createTextNode(result.Item.ListofProductIDSelling);
    let user_sold_list = document.createTextNode(result.Item.ListofProductIDSold);
    let user_user_id = document.createTextNode(result.Item.UserID);
    
    


}