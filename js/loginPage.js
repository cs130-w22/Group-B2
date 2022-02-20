function validate()
{
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;

    var re = new RegExp("^([A-Za-z0-9])+@g.ucla.edu$");

    if (re.test(email) && email=="admin@g.ucla.edu" && password=="password") {
        window.location.href = "http://www.google.com";
    } else {
        alert("invalid account");
    }

}