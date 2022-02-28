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

test("Calling makeUpdateParam()...", () => {
    const params = dynamo.makeUpdateParam("TestTable", "TestID", "TestAttrName", "TestAttrVal");
    expect(params.TableName).toBe("TestTable");
    expect(params.Key).toStrictEqual({"UserID": "TestID"});
    expect(params.UpdateExpression).toBe("set #wishlist = :newWishlist");
    expect(params.ExpressionAttributeNames).toStrictEqual({"#wishlist": "TestAttrName"});
    expect(params.ExpressionAttributeValues).toStrictEqual({":newWishlist": "TestAttrVal"});
})

test("Calling makePutParam()...", () => {
    const params = dynamo.makePutParam("TestProductID", "TestCost", "TestItem", "TestImageURL", "TestImageID", "TestCategory", "TestUserID");
    const ItemParam = params.Item
    expect(params.TableName).toBe("ProductCatalog");
    expect(ItemParam.ProductID).toBe("TestProductID");
    expect(ItemParam.Cost).toBe("TestCost");
    expect(ItemParam.UserID).toBe("TestUserID");
    //expect(ItemParam.Location).toBe("TestUserID");
    expect(ItemParam.Product).toBe("TestItem");
    expect(ItemParam.ImageID).toBe("TestImageID");
    expect(ItemParam.ImageUrl).toBe("TestImageURL");
    expect(ItemParam.ProductType).toBe("TestCategory");
    //expect(ItemParam.SellerName).toBe("TestUserID");
})