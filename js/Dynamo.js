const AmazonDaxClient = require('amazon-dax-client');
var AWS = require("aws-sdk");
var dotenv = require("dotenv");
dotenv.config();

var region = "us-west-1";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: region
});

export class Dynamo {
    constructor() {
        console.log(process.env.AWS_ACCESS_KEY_ID);
        this.client = new AWS.DynamoDB() //low-level client

        //his.client = daxClient != null ? daxClient : ddbClient;
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
                ":val": { "S" : attrVal }
            }
        };
    
        return params;
    }

    queryTable(tableName, indexName, attrName, attrVal) {
        let params = this.makeParam(tableName, indexName, attrName, attrVal);
        try {
            const resp = this.client.query(params).promise();
            return resp;
        } catch (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
    }
}