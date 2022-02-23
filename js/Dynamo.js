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

    makeGetUserParam(tableName, userID) {
        let params = {
            TableName : tableName,
            Key: {
                "UserID": userID
            }
        };
    
        return params;
    }

    makeGetProductParam(tableName, productID) {
        let params = {
            TableName : tableName,
            Key: {
                "ProductID": productID
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
            params = this.makeGetUserParam(tableName, val);
        } else if (key == "ProductID") {
            params = this.makeGetProductParam(tableName, val);
        }
        try {
            const resp = this.client.get(params).promise();
            return resp;
        } catch (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
    }

    putTable(productID, itemCost, itemName, imageID, itemCategory) {
        console.log("putting table");
        var params = {
            TableName: 'ProductCatalog',
            Item: {
                ProductID: String(productID),
                Cost: String(itemCost),
                UserID: 'cookies',
                Location: 'cookies',
                Product: String(itemName),
                ImageID: String(imageID),
                ProductType: String(itemCategory),
                SellerName: 'cookies'
            }
        };
        try {
            const resp = this.client.put(params).promise();
            return resp;
        } catch (err) {
            console.error("unable to put table");
        }
        console.log("... leaving putTable func");
    }

    createS3Bucket(imageID){
        console.log("creating bucket...")
        var params = {
            Bucket: String(imageID),
            CreateBucketConfiguration: {
                LocationConstraint: "us-west-1"
            }
        };
        
        try {
            const resp = this.s3.createBucket(params).promise();
            return resp;
        } catch (err) {
            console.error("unable to create s3 bucket");
        }
        console.log("... leaving createS3Bucket func");
    }

    putImage(imageID){
        console.log("putting image...");
        var params = {
            Body: "data",
            Bucket: imageID,
        };
        try{
            const resp = this.s3.putObject(params).promise();
            return resp; 
        } catch(err) {
            console.error("unable to put image");
        }
        console.log("... leaving putImage func");
    }
}