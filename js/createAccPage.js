/**
 * @file Create account logic file
 */
import { Dynamo } from "./Dynamo.js"
var crypto = require("crypto");

/**
 * Dynamo Object
 * @type {Dynamo}
 */
var docClientDynamo = null;

// function setCookie(name, exdays) {
//     var exdate = new Date();
//     exdate.setDate(exdate.getDate() + exdays);
//     var exp_value = "; expires=" + exdate.toUTCString() + "; path=/";
//     document.cookie = "UserID=" + generateID(5) + "; SellerName=" + name + exp_value;
// }

/**
 * Generate an ID given length
 * @param {Number} length Length of ID
 * @returns String
 */
function generateID(length) {
    return crypto.randomBytes(length).toString('hex');
}

window.onload = function () {
    let submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", validate, false);

    docClientDynamo = new Dynamo();
}

/**
 * Validate all input fields when create account button is clicked
 * @returns void
 */
function validate()
{
    var firstName=document.getElementById("firstName").value;
    var lastName=document.getElementById("lastName").value;
    var email=document.getElementById("email").value;
    var phoneNumber=document.getElementById("phoneNumber").value;
    var streetAddr=document.getElementById("streetAddress").value;
    var password=document.getElementById("password").value;
    var passwordCheck=document.getElementById("passwordRe").value;

    var emailDomain = new RegExp("^([A-Za-z0-9])+@g.ucla.edu$");
    var phoneNumFormat = new RegExp("^([0-9]{3})-([0-9]{3})-([0-9]{4})$");

    if (!emailDomain.test(email)){
        alert("invalid email, please enter g.ucla.edu email");
        return false;
    }

    if (!phoneNumFormat.test(phoneNumber)){
        alert("invalid phone number, please enter in xxx-xxx-xxxx format");
        return false;
    }

    if (password != passwordCheck){
        alert("passwords do not match!");
        return false;
    }

    if (password.length < 6){
        alert("password must be 6 or more characters");
        return false;
    } 
    //setCookie(firstName+lastName, 1); 

    var userID = generateID(5);
    doCreateUserTask(firstName, lastName, email, phoneNumber, streetAddr, password, userID);
    
}

/**
* Adds all infomation to the database when creating an account
* @param {String} firstName First name of user
* @param {String} lastName Last name of user
* @param {String} email User's ucla email address
* @param {String} phone User's phone number
* @param {String} street User's street address
* @param {String} password User's password
* @param {String} userID Unique user ID
* @returns void
*/
async function doCreateUserTask(firstName, lastName, email, phone, street, password, userID) {
    const respDynamoAddUser = await docClientDynamo.putUserEntry(firstName, lastName, email, phone, street, password, userID);
    console.log(respDynamoAddUser);
    const respDynamoAddUserCred = await docClientDynamo.putUserCredEntry(email, password, userID);
    console.log(respDynamoAddUserCred);

    if (respDynamoAddUser['$response']['httpResponse']['statusCode'] == 200 && respDynamoAddUserCred['$response']['httpResponse']['statusCode'] == 200) {
        window.location.href = "./catalog.html";
    } else {
        window.alert("Error in creating user! Please try again.");
    }
}