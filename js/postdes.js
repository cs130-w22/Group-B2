/**
 * @file Post Description Page
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
 * Removes product information from a user's profile in the database 
 * @param {String} productID Product ID
 * @param {String} catalog ProductCatalog
 * @param {String} userID Seller's User ID
 * @returns void
 */
async function getPost(catalog, productID, userID){
    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    
}
 