const AmazonDaxClient = require('amazon-dax-client');
var AWS = require("aws-sdk");
var dotenv = require("dotenv");
dotenv.config();

var region = "us-west-1";

AWS.config.update({
  region: region
});

export class Dynamo {
    constructor() {
        AWS.config.getCredentials(function(err) {
            if (err) console.log(err.stack);
            // credentials not loaded
            else {
              console.log("Access key:", AWS.config.credentials.accessKeyId);
            }
        });
        this.client = new AWS.DynamoDB() //low-level client

        //this.client = daxClient != null ? daxClient : ddbClient;
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