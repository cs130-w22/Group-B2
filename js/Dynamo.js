/**
 * @file Dynamo DB Wrapper class
 */
var AWS = require("aws-sdk");
var dotenv = require("dotenv");
dotenv.config();

/**
 * Dynamo DB Wrapper class to create Dynamo Object
 */
export class Dynamo {
    constructor() {
        AWS.config.update({
            region: process.env.REGION,
            accessKeyId: process.env.ACCESS_ID,
            secretAccessKey: process.env.ACCESS_KEY,
            endpoint: process.env.ENDPOINT
        });
        /**
         * @property {AWS.DynamoDB.DocumentClient} client Dynamo DB Document Client Object
         */
        this.client = new AWS.DynamoDB.DocumentClient();
    }

    /**
     * Creates Parameter function for Dynamo queryTable function
     * @param {String} tableName Table Name of Dynamo DB
     * @param {String} indexName Index Name in that Dynamo DB
     * @param {String} attrName Attribute Name of the column
     * @param {String} attrVal Attribute Value of the column
     * @returns Object
     */
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

    /**
     * Creates Parameter function for Dynamo getTableEntry to get User Information
     * @param {String} tableName Table Name of Dynamo DB
     * @param {String} userID User ID, key for the table
     * @returns Object
     */
    makeUserParam(tableName, userID) {
        let params = {
            TableName : tableName,
            Key: {
                "UserID": userID
            }
        };
    
        return params;
    }

    /**
     * Creates Parameter function for Dynamo getTableEntry to get Product Information
     * @param {String} tableName Table Name of Dynamo DB
     * @param {String} productID Product ID, key for the table
     * @returns Object
     */
    makeProductParam(tableName, productID) {
        let params = {
            TableName : tableName,
            Key: {
                "ProductID": productID
            }
        };
    
        return params;
    }

    /**
     * Creates Parameter function for Dynamo updateTableEntry function to update values
     * @param {String} tableName Table Name of Dynamo DB
     * @param {String} userID User Name, key for the table
     * @param {String} attrName Attribute Name of the column
     * @param {String} attrVal Attribute Value of the column
     * @returns Object
     */
    makeUpdateParam(tableName, userID, attrName, attrVal) {
        let params = {
            TableName : tableName,
            Key: {
                "UserID": userID
            },
            UpdateExpression: 'set #list = :list',
            ExpressionAttributeNames: {'#list' : attrName},
            ExpressionAttributeValues: { ':list' : attrVal }
        };
    
        return params;
    }

    /**
     * Creates Parameter function for Dynamo putProductTableEntry function to add product entries
     * @param {String} productID Product ID
     * @param {String} itemCost Cost of the product
     * @param {String} itemDescription Description of product
     * @param {String} address Address location of the product
     * @param {String} itemName Product Name
     * @param {String} imageUrl Image URL for extracting to display on pages
     * @param {String} imageID Image ID stored in S3 bucket
     * @param {String} itemCategory Category code
     * @param {String} userID Seller's User ID
     * @returns Object
     */
    makeProductPutParam(productID, itemCost, itemDescription, address, itemName, imageUrl, imageID, itemCategory, userID) {
        let params = {
            TableName: 'ProductCatalog',
            Item: {
                ProductID: String(productID),
                Cost: String(itemCost),
                UserID: userID,
                Location: address,
                Product: String(itemName),
                ImageID: String(imageID),
                ImageUrl: imageUrl,
                ProductType: String(itemCategory),
                SellerName: 'cookies',
                Description: itemDescription
            }
        };
        return params;
    }

    /**
     * Creates Parameter function for Dynamo putProductWishlistWatchEntry function to add wishlist watch
     * @param {String} productID 
     * @returns Object
     */
    makeProductWishlistWatchParam(productID) {
        let params = {
            TableName: 'Wishlist',
            Item: {
                ProductID: String(productID),
                ListOfUsers: []
            }
        };
        return params;
    }

    /**
     * Queries Dynamo DB table
     * @param {String} tableName Table Name
     * @param {String} indexName Index Key
     * @param {String} attrName Attribute Name of the column
     * @param {String} attrVal Attribute Value of the column
     * @returns Promise
     */
    queryTable(tableName, indexName, attrName, attrVal) {
        let params = this.makeQueryParam(tableName, indexName, attrName, attrVal);
        try {
            const resp = this.client.query(params).promise();
            return resp;
        } catch (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
    }

    /**
     * Get table entry in Dynamo DB given name
     * @param {String} tableName Table Name
     * @param {String} key Key index
     * @param {String} val Value to search of that key
     * @returns Promise
     */
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

    /**
     * Update table entry in Dynamo DB given table name
     * @param {String} tableName Table Name
     * @param {String} key Key index to search
     * @param {String} attrName Attribute Name of the column
     * @param {String} attrVal Attribute Value of the column to update entry
     * @returns Promise
     */
    updateTableEntry(tableName, key, attrName, attrVal) {
        let params = this.makeUpdateParam(tableName, key, attrName, attrVal);
        try {
            const resp = this.client.update(params).promise();
            return resp;
        } catch (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
    }

    /**
     * Put product entry into Dynamo DB 
     * @param {String} productID Product ID
     * @param {String} itemCost Cost of the product
     * @param {String} address Address location of the product
     * @param {String} itemName Product Name
     * @param {String} imageUrl Image URL for extracting to display on pages
     * @param {String} imageID Image ID stored in S3 bucket
     * @param {String} itemCategory Category code
     * @param {String} userID Seller's User ID
     * @returns Promise
     */
    putProductTableEntry(productID, itemCost, itemDescription, address, itemName, imageUrl, imageID, itemCategory, userID) { 
        let params = this.makeProductPutParam(productID, itemCost, itemDescription, address, itemName, imageUrl, imageID, itemCategory, userID);
        try {
            const resp = this.client.put(params).promise();
            return resp
        } catch (err) {
            console.error("Unable to put. Error:", JSON.stringify(err, null, 2));
        }
    }

    /**
     * Creates Parameter function for Dynamo deleteProductTableEntry function to remove product entries
     * @param {String} productID Product ID
     * @returns Object
     */
    makeProductDeleteParam(productID){
        let params = {
            TableName: 'ProductCatalog',
            Item: {
                ProductID: productID,
            }
        };
        return params;
    }

    /**
     * Delete product entry in Dynamo DB ProductCatalog
     * @param {String} productID Product ID
     * @returns Promise
     */
    deleteProductTableEntry(productID){
        let params = this.makeProductDeleteParam(productID)
        try{
            const resp = this.client.delete(params).promise(); 
            return resp
        } catch (err) {
            console.error("Unable to delete. Error:", JSON.stringify(err, null, 2));
        }
    }

    /**
     * Create Wishlist watch entry into Wishlist Dynamo DB table
     * @param {String} productID Product ID
     * @returns Promise
     */
    putProductWishlistWatchEntry(productID) { 
        let params = this.makeProductWishlistWatchParam(productID);
        try {
            const resp = this.client.put(params).promise();
            return resp
        } catch (err) {
            console.error("Unable to put. Error:", JSON.stringify(err, null, 2));
        }
    }
}