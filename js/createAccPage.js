
function setCookie(name, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var exp_value = "; expires=" + exdate.toUTCString() + "; path=/";
    document.cookie = "UserID=" + makeid(5) + "; SellerName=" + name + exp_value;
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

window.onload = function () {
    let submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", validate, false);
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
    
    // temporary redirect for local catalog page 
    //window.location.href = "../catalog.html";

}