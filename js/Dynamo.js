var AWS = require("aws-sdk");
var dotenv = require("dotenv");
dotenv.config();

export class Dynamo {
    constructor() {
        AWS.config.update({
            region: process.env.REGION,
            accessKeyId: process.env.ACCESS_ID,
            secretAccessKey: process.env.ACCESS_KEY,
            endpoint: process.env.ENDPOINT
        });
        this.client = new AWS.DynamoDB.DocumentClient();
    }

    makeQueryParam(tableName, indexName, attrName, attrVal) {
        let params = {
            TableName : tableName,
            IndexName: indexName,
            KeyConditionExpression: "#val = :val",
            ExpressionAttributeNames:{
                "#val": attrName
            },
            ExpressionAttributeValues: {
                ":val": attrVal
            }
        };
    
        return params;
    }

    makeUserParam(tableName, userID) {
        let params = {
            TableName : tableName,
            Key: {
                "UserID": userID
            }
        };
    
        return params;
    }

    makeProductParam(tableName, productID) {
        let params = {
            TableName : tableName,
            Key: {
                "ProductID": productID
            }
        };
    
        return params;
    }

    makeUpdateParam(tableName, id, attrName, attrVal) {
        let params = {
            TableName : tableName,
            Key: {
                "UserID": id
            },
            UpdateExpression: 'set #wishlist = :newWishlist',
            ExpressionAttributeNames: {'#wishlist' : attrName},
            ExpressionAttributeValues: { ':newWishlist' : attrVal }
        };
    
        return params;
    }

    makePutParam(productID, itemCost, itemName, imageUrl, imageID, itemCategory, userID) {
        let params = {
            TableName: 'ProductCatalog',
            Item: {
                ProductID: String(productID),
                Cost: String(itemCost),
                UserID: userID,
                Location: 'cookies',
                Product: String(itemName),
                ImageID: String(imageID),
                ImageUrl: imageUrl,
                ProductType: String(itemCategory),
                SellerName: 'cookies'
            }
        };
        return params;
    }

    queryTable(tableName, indexName, attrName, attrVal) {
        let params = this.makeQueryParam(tableName, indexName, attrName, attrVal);
        try {
            const resp = this.client.query(params).promise();
            return resp;
        } catch (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
    }

    getTableEntry(tableName, key, val) {
        let params = null;
        if (key == "UserID") {
            params = this.makeUserParam(tableName, val);
        } else if (key == "ProductID") {
            params = this.makeProductParam(tableName, val);
        }
        try {
            const resp = this.client.get(params).promise();
            return resp;
        } catch (err) {
            console.error("Unable to get. Error:", JSON.stringify(err, null, 2));
        }
    }

    updateTableEntry(tableName, key, attrName, attrVal) {
        let params = this.makeUpdateParam(tableName, key, attrName, attrVal);
        try {
            const resp = this.client.update(params).promise();
            return resp;
        } catch (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
    }

    putProductTableEntry(productID, itemCost, itemName, imageUrl, imageID, itemCategory, userID) { 
        let params = this.makePutParam(productID, itemCost, itemName, imageUrl, imageID, itemCategory, userID);
        try {
            const resp = this.client.put(params).promise();
            return resp
        } catch (err) {
            console.error("Unable to put. Error:", JSON.stringify(err, null, 2));
        }
    }
}