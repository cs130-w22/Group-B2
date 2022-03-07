/**
 * @file Post Description Page
 */
import { Dynamo } from "./Dynamo.js"
import { S3Bucket } from "./S3Bucket.js"
import * as cookie from './cookie.js'
import * as utils from './utils.js'

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
const userID = cookie.getCookie("UserID");
/**
 * Parameters in URL
 * @type {String}
 */
const queryString = window.location.search;
/**
 * Parameters parsed in object
 * @type {Object}
 */
const urlParams = new URLSearchParams(queryString);
/**
 * Product ID
 * @type {String}
 */
const productID = urlParams.get('productid');

window.onload = function() {
   if (userID == "") {
      window.alert("You are not logged in. Redirecting to login page.");
      window.location.href = "./loginPage.html";
   }
   docClientDynamo = new Dynamo(); 
   docClientS3 = new S3Bucket();

   let logoutButton = document.getElementById("logout");
   logoutButton.addEventListener("click", utils.logout, false);

   getPost();

   let buyButton = document.getElementById("buy");
   let wishlistButton = document.getElementById("addToWishlist");

   buyButton.addEventListener("click", purchaseProduct);
   wishlistButton.addEventListener("click", addToWishlist);
} 

/**
 * posts description 
 * @returns void
 */
async function getPost(){
   const respDyanmoGetProductEntry = await docClientDynamo.getTableEntry("ProductCatalog", productID);

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

   let sellerLink = utils.createTag('a', null, null);
   sellerLink.href = "./sellerProfile.html?sellerID=" + userID;
   sellerLink.appendChild(document.createTextNode(seller));
   document.getElementById("name").appendChild(document.createTextNode("Seller's Name: "))
   document.getElementById("name").appendChild(sellerLink);
   document.getElementById("image").src = image;
   document.getElementById("description").innerHTML = desc;
   const respDyanmoGetUserEntry = await docClientDynamo.getTableEntry('UserInformation', userID);

   const phone = respDyanmoGetUserEntry.Item.PhoneNumber;
   const email = respDyanmoGetUserEntry.Item.Email;
   document.getElementById("phone").innerHTML = "Phone Number: " + phone;
   document.getElementById("email").innerHTML = "Email: " + email;
   //document.getElementById("profile").href = "/myprofile.html?userid=" + userID;
}

async function purchaseProduct() {
   if(confirm("Do you wish to proceed buying the product?")) {
      // change isBought to yes for product ID
      console.log('8');
      const respDyanmoUpdateProductEntry = await docClientDynamo.updateTableEntry('ProductCatalog', productID, 'isBought', 'yes');
      console.log('1');
      // error check
      if (respDyanmoUpdateProductEntry['$response']['httpResponse']['statusCode'] == 200) {
            window.alert("Purchase successful");
            const respDyanmoGetProductEntry = await docClientDynamo.getTableEntry("ProductCatalog", productID);
            window.location.href = "./sellerProfile.html?sellerID=" + respDyanmoGetProductEntry.Item['UserID'];
      } else {
         window.alert("Error purchasing product")
      }
   }
}

/**
 * Trigger button to add product to wishlist
 * @returns void
 */
async function addToWishlist() {
   if(confirm("Do you wish add this product to your wishlist?")){
      const respDyanmoGetUserEntry = await docClientDynamo.getTableEntry('UserInformation', userID);
      const respDyanmoGetProductWishlist = await docClientDynamo.getTableEntry("Wishlist", productID);

      var newWishlistFromUser = utils.arrayAppend(respDyanmoGetUserEntry.Item['Wishlist'], productID);
      var newWishlistWatch = utils.arrayAppend(respDyanmoGetProductWishlist.Item['ListOfUsers'], userID);

      const respUpdateUserWishlist = await docClientDynamo.updateTableEntry('UserInformation', userID, 'Wishlist', newWishlistFromUser);
      const respUpdateWishlistWatch = await docClientDynamo.updateTableEntry('Wishlist', productID, 'ListOfUsers', newWishlistWatch);

      if (respUpdateUserWishlist['$response']['httpResponse']['statusCode'] == 200 &&
          respUpdateWishlistWatch['$response']['httpResponse']['statusCode'] == 200) {
         window.alert("Product added to your wishlist!");
      } else {
         window.alert("Something went wrong...");
      }
   }
}