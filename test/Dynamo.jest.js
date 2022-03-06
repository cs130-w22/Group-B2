const { Dynamo } = require('../js/Dynamo.js');

var dynamo = new Dynamo();

test("Calling makeQueryParam()...", () => {
    const params = dynamo.makeQueryParam("TestTable", "TestIndex", "TestAttrName", "TestAttrVal");
    expect(params.TableName).toBe("TestTable");
    expect(params.IndexName).toBe("TestIndex");
    expect(params.KeyConditionExpression).toBe("#val = :val");
    expect(params.ExpressionAttributeNames).toStrictEqual({"#val": "TestAttrName"});
    expect(params.ExpressionAttributeValues).toStrictEqual({":val": "TestAttrVal"});
})

test("Calling makeUserParam()...", () => {
    const params = dynamo.makeUserParam("TestTable", "TestID");
    expect(params.TableName).toBe("TestTable");
    expect(params.Key).toStrictEqual({"UserID": "TestID"});
})

test("Calling makeProductParam()...", () => {
    const params = dynamo.makeProductParam("TestTable", "TestProductID");
    expect(params.TableName).toBe("TestTable");
    expect(params.Key).toStrictEqual({"ProductID": "TestProductID"});
})

test("Calling makeUserCredParam()...", () => {
    const params = dynamo.makeUserCredParam("TestTable", "TestEmail");
    expect(params.TableName).toBe("TestTable");
    expect(params.Key).toStrictEqual({"Email": "TestEmail"});
})

test("Calling makeUpdateParamUser()...", () => {
    const params = dynamo.makeUpdateParamUser("TestTable", "TestID", "TestAttrName", "TestAttrVal");
    expect(params.TableName).toBe("TestTable");
    expect(params.Key).toStrictEqual({"UserID": "TestID"});
    expect(params.UpdateExpression).toBe("set #list = :list");
    expect(params.ExpressionAttributeNames).toStrictEqual({"#list": "TestAttrName"});
    expect(params.ExpressionAttributeValues).toStrictEqual({":list": "TestAttrVal"});
})

test("Calling makeUpdateParamProduct()...", () => {
    const params = dynamo.makeUpdateParamProduct("TestTable", "TestID", "TestAttrName", "TestAttrVal");
    expect(params.TableName).toBe("TestTable");
    expect(params.Key).toStrictEqual({"ProductID": "TestID"});
    expect(params.UpdateExpression).toBe("set #list = :list");
    expect(params.ExpressionAttributeNames).toStrictEqual({"#list": "TestAttrName"});
    expect(params.ExpressionAttributeValues).toStrictEqual({":list": "TestAttrVal"});
})

test("Calling makeProductPutParam()...", () => {
    const params = dynamo.makeProductPutParam("TestProductID", "TestCost", "TestDes", "TestAddr", "TestItem", "TestImageURL", "TestImageID", "TestCategory", "TestName", "TestUserID");
    const ItemParam = params.Item
    expect(params.TableName).toBe("ProductCatalog");
    expect(ItemParam.ProductID).toBe("TestProductID");
    expect(ItemParam.Description).toBe("TestDes");
    expect(ItemParam.Cost).toBe("TestCost");
    expect(ItemParam.UserID).toBe("TestUserID");
    expect(ItemParam.Location).toBe("TestAddr");
    expect(ItemParam.Product).toBe("TestItem");
    expect(ItemParam.ImageID).toBe("TestImageID");
    expect(ItemParam.ImageUrl).toBe("TestImageURL");
    expect(ItemParam.ProductType).toBe("TestCategory");
    expect(ItemParam.SellerName).toBe("TestName");
})

test("Calling makeProductWishlistWatchParam()...", () => {
    const params = dynamo.makeProductWishlistWatchParam("TestID");
    expect(params.TableName).toBe("Wishlist");
    expect(params.Item.ProductID).toBe("TestID");
    expect(params.Item.ListOfUsers).toStrictEqual([]);
})

test("Calling makeUserPutParam()...", () => {
    const params = dynamo.makeUserPutParam("TestFirstName", "TestLastName", "TestEmail", "TestPhone", "TestStreet", "TestPassword", "TestUserID");
    expect(params.TableName).toBe("UserInformation");
    expect(params.Item.FirstName).toBe("TestFirstName");
    expect(params.Item.LastName).toBe("TestLastName");
    expect(params.Item.Email).toBe("TestEmail");
    expect(params.Item.PhoneNumber).toBe("TestPhone");
    expect(params.Item.Address).toBe("TestStreet");
    expect(params.Item.Password).toBe("TestPassword");
    expect(params.Item.UserID).toBe("TestUserID");
    expect(params.Item.ListofProductIDSelling).toStrictEqual([]);
    expect(params.Item.Wishlist).toStrictEqual([]);
    expect(params.Item.ListofProductIDSold).toStrictEqual([]);
})

test("Calling makeUserCredPutParam()...", () => {
    const params = dynamo.makeUserCredPutParam("TestEmail", "TestPassword", "TestUserID");
    expect(params.TableName).toBe("UserCred");
    expect(params.Item.Email).toBe("TestEmail");
    expect(params.Item.Password).toBe("TestPassword");
    expect(params.Item.UserID).toBe("TestUserID");
})