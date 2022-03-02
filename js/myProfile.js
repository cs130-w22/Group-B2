/**
 * @file profile page logic 
 */
import { Dynamo } from "./Dynamo.js"
import { S3Bucket } from "./S3Bucket.js"

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

window.onload = function(){
    docClientDynamo = new Dynamo(); 
    docClientS3 = new S3Bucket(); 
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
        newProductSellingList = splce(indexOfProduct, 1);
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
