import { Dynamo } from "./Dynamo.js"
import { S3Bucket } from "./S3Bucket.js"
var crypto = require("crypto");

var docClientS3 = null;
var docClientDynamo = null;

window.onload = function() {
    let createPostButton = document.getElementById("submit");
    createPostButton.addEventListener("click", validatePostCreation, false);

    docClientS3 = new S3Bucket();
    docClientDynamo = new Dynamo();
}

async function validatePostCreation() {
    var itemName = document.getElementById("item_name").value;
    var itemCost = document.getElementById("item_cost").value;
    var itemDescription = document.getElementById("item_description").value;
    var itemCategory = document.getElementById("category").value;
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
    const respDynamo = await docClientDynamo.putTable(productID, itemCost, itemName, imageID, itemCategory);
    const respS3 = await getPresignedAndUpload(productID + "/" + imageID, image);

    if (respDynamo['$response']['httpResponse']['statusCode'] == 200 && respS3['status'] == 200) {
        window.alert("Post uploaded! Check the catalog to see your post!");
    } else {
        window.alert("Something went wrong...\nDynamo Status: " 
        + respDynamo['$response']['httpResponse']['statusCode'] 
        + "\nS3 Status: " + respS3);
    }
}

async function getPresignedAndUpload(directory, image) {
    const url = await docClientS3.generateURL(directory);
    const resp = await fetch(url, {
        method: "PUT",
        headers: {
           "Content-Type": "multipart/form-data"
        },
        body: image
    });

    return resp;
}

function generateID(length) {
    return crypto.randomBytes(length).toString('hex');
}