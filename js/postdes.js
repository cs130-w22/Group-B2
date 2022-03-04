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

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productid = urlParams.get('productid');
    getPost(productid);
    let buyButton = document.getElementById("buy");
    buyButton.addEventListener("click", pop);
 } 

/**
 * posts description 
 * @returns void
 */
 async function getPost(productID){
    const respDyanmoGetProductEntry = await docClientDynamo.getTableEntry("ProductCatalog","ProductID",productID);
    console.log(respDyanmoGetProductEntry);
    const cost = respDyanmoGetProductEntry.Item.Cost;
    const location = respDyanmoGetProductEntry.Item.Location;
    const product = respDyanmoGetProductEntry.Item.Product;
    const image = respDyanmoGetProductEntry.Item.ImageUrl;
    const seller = respDyanmoGetProductEntry.Item.SellerName;
    const desc = respDyanmoGetProductEntry.Item.Description;
    const userID = respDyanmoGetProductEntry.Item.UserID;
    document.getElementById("cost").innerHTML = "$" + cost;
    document.getElementById("location").innerHTML = "Location: " + location;
    document.getElementById("product_name").innerHTML = product;
    document.getElementById("name").innerHTML = "Seller's Name: " + seller;
    document.getElementById("image").src = image;
    document.getElementById("description").innerHTML = desc;
    const respDyanmoGetUserEntry = await docClientDynamo.getTableEntry('UserInformation', 'UserID', userID);
    console.log(respDyanmoGetUserEntry);
    const phone = respDyanmoGetUserEntry.Item.PhoneNumber;
    const email = respDyanmoGetUserEntry.Item.Email;
    document.getElementById("phone").innerHTML = "Phone Number: " + phone;
    document.getElementById("email").innerHTML = "Email: " + email;
    document.getElementById("profile").href = "/myprofile.html?userid=" + userID;
}

async function pop() {
   if(confirm("Do you wish to proceed buying the product?")){
      window.location.href =  "./myprofile.html";
   }
 }