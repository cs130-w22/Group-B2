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

    makeParam(tableName, indexName, attrName, attrVal) {
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

    queryTable(tableName, indexName, attrName, attrVal) {
        let params = this.makeParam(tableName, indexName, attrName, attrVal);
        try {
            const resp = this.client.query(params).promise();
            console.log("Query succeeded.");
            return resp;
        } catch (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
    }
}