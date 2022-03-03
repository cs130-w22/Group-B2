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
 * posts description 
 * @returns void
 */
async function getPost(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let productID = "";
    if(urlParams.has("ProductID")){
        productID = urlParams.get("ProductID");
    }
    const respDyanmoGetProductEntry = await docClientDynamo.getTableEntry("ProductCatalog","ProductID",productID);
    const cost = respDyanmoGetProductEntry.Item.Cost;
    const location = respDyanmoGetProductEntry.Item.Location;
    const product = respDyanmoGetProductEntry.Item.Product;
    const image = respDyanmoGetProductEntry.Item.ImageUrl;
    const seller = respDyanmoGetProductEntry.Item.SellerName;
    document.getElementById("cost").innerHTML = cost;
    document.getElementById("location").innerHTML = location;
    document.getElementById("product_name").innerHTML = product;
    document.getElementById("name").innerHTML = seller;
    document.getElementById("image").innerHTML = image;
}
 