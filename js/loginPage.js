/**
 * @file Login logic file
 */
import { Dynamo } from "./Dynamo.js"
import * as cookie from './cookie.js'

/**
 * Dynamo Object
 * @type {Dynamo}
 */
var docClient = null;

window.onload = function() {
    var userID = cookie.getCookie("UserID");
	if (userID != "") {
		window.location.href = "./catalog.html";
	}
    let loginButton = document.getElementById("Login");
    docClient = new Dynamo();

	loginButton.addEventListener("click", validate, false);
}

/**
 * Email and password validation function
 * @returns void
 */
async function validate()
{
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;


    const resp = await docClient.getTableEntry("UserCred", "Email", email);
    console.log(resp);
    if (resp.Item == null){ //Then email does not exist in database
        alert("invalid email or password!");
    } else {
        if (resp.Item["Password"] == password){
            cookie.setCookie(resp.Item["UserID"], 5);
            window.location.href = "./catalog.html";
        } else{
            alert("invalid email or password");
        }
    }
}