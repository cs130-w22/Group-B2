import * as cookie from '../js/cookie.js'

test("Calling setCookie()...", () => {
    cookie.setCookie("TestID", 1);
    expect(document.cookie).toBe("UserID=TestID");
})

test("Calling getCookie()...", () => {
    var userCookie = cookie.getCookie("UserID");
    expect(userCookie).toBe("TestID");
})

test("Calling deleteCookie()...", () => {
    cookie.deleteCookie("UserID");
    expect(document.cookie).toBe("");
})