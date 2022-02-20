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

    window.location.href = "http://www.google.com";

}