import { Dynamo } from "./Dynamo.js"
var crypto = require("crypto");

var docClientDynamo = null;

function setCookie(name, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var exp_value = "; expires=" + exdate.toUTCString() + "; path=/";
    document.cookie = "UserID=" + generateID(5) + "; SellerName=" + name + exp_value;
}

function generateID(length) {
    return crypto.randomBytes(length).toString('hex');
}

window.onload = function () {
    let submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", validate, false);

    docClientDynamo = new Dynamo();
}


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
    setCookie(firstName+lastName, 1); 

    var userID = generateID(5);
    doCreateUserTask(firstName, lastName, email, phoneNumber, streetAddr, password, userID);
    
}

async function doCreateUserTask(firstName, lastName, email, phone, street, password, userID) {
    const respDynamoAddUser = await docClientDynamo.putUserEntry(firstName, lastName, email, phone, street, password, userID);
    const respDynamoAddUserCred = await docClientDynamo.putUserCredEntry(email, password, userID);

    if (respDynamoAddUser['$response']['httpResponse']['statusCode'] == 200 && respDynamoAddUserCred['$response']['httpResponse']['statusCode'] == 200) {
        window.location.href = "./catalog.html";
    } else {
        window.alert("Error in creating user! Please try again.");
    }
}

function generateID(length) {
    return crypto.randomBytes(length).toString('hex');
}