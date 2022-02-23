import { Dynamo } from "./Dynamo.js"

var docClient = new Dynamo();

window.onload = function () {
    let createPostButton = document.getElementById("submit");
    createPostButton.addEventListener("click", validatePostCreation, false);
}



async function validatePostCreation() {
    var itemName = document.getElementById("item_name").value;
    var itemCost = document.getElementById("item_cost").value;
    var itemDescription = document.getElementById("item_description").value;
    var itemCategory = document.getElementById("category").value;
    var image = document.getElementById("myFile").value;

    var cost = new RegExp('([0-9])+\.?([0-9])*');

    if (itemName == "") {
        alert("please enter item name");
        return false;
    }

    if (!cost.test(itemCost)) {
        //console.log("uh");
        alert("please enter valid item cost");
        return false;
    } else {

        if (itemCost.indexOf('.') == itemCost.length - 3 || itemCost.indexOf('.') == itemCost.length - 2) {
            // okay format
            // $x.x
            // $x.xx
            // $x
        } else {
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

    var productID = generateString(8);
    var imageID = generateString(8);
    await docClient.putTable(productID, itemCost, itemName, (image+imageID), itemCategory);
    console.log("1");
    await docClient.createS3Bucket((image+imageID));
    console.log("2");
    await docClient.putImage((image+imageID));
    console.log("3");
    //docClient.putS3(image+imageID, image);

}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function generateString(length) {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}



