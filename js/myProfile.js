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


export function removePostFromTable(userID, productID){
    const respDyanmoGetUserEntry = await docClientDynamo.getTableEntry('UserInformation', 'UserID', userID);
    const userSellingProductIDList = respDyanmoGetUserEntry.Item['ListofProductIDSelling']
    const indexOfProduct = indexOf(userSellingProductIDList, productID);
    const newProductSellingList; 
    if(indexOfProduct > -1){
        newProductSellingList = splce(indexOfProduct, 1); 
    } else {
        newProductSellingList = userSellingProductIDList 
    }
    const respDynamoAddProductToUser = await docClientDynamo.updateTableEntry('UserInformation', userID, 'ListofProductIDSelling', newProductSellingList);
    // error check? 
}
