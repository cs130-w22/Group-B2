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

    makeUpdateParam(tableName, id, newList) {
        let params = {
            TableName : tableName,
            Key: {
                "UserID": id
            },
            UpdateExpression: 'set #wishlist = :newWishlist',
            ExpressionAttributeNames: {'#wishlist' : 'Wishlist'},
            ExpressionAttributeValues: { ':newWishlist' : newList }
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
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
    }

    updateTableEntry(tableName, key, val) {
        let params = this.makeUpdateParam(tableName, key, val);
        try {
            const resp = this.client.update(params).promise();
            return resp;
        } catch (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
    }

    putTable() {
        console.log("... into putTable func");
        var params = {
            TableName: 'ProductCatalog',
            Item: {
                ProductID: 'pid2',
                Cost: '100',
                UserID: 'cookies',
                Location: 'cookies',
                Product: 'pname',
                ImageID: 'iid',
                ProductType: 'pcategory',
                SellerName: 'cookies'
            }
        };
        try {
            const resp = this.client.put(params).promise();
            return resp;
        } catch (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
    }
}