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
        var ddbClient = new AWS.DynamoDB.DocumentClient()
        var daxClient = null;

        if (process.argv.length > 2) {
            var dax = new AmazonDaxClient({endpoints: [process.argv[2]], region: region})
            daxClient = new AWS.DynamoDB.DocumentClient({service: dax });
        }

        this.client = daxClient != null ? daxClient : ddbClient;
        //this.client = new AWS.DynamoDB();
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