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
     * Creates Parameter function for Dynamo getTableEntry to get Product Information and Wishlist watch
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
     * Creates Parameter function for Dynamo getTableEntry to get user email and password information
     * @param {String} tableName Table Name of Dynamo DB
     * @param {String} userEmail User Email, key for the table
     * @returns Object
     */
    makeUserCredParam(tableName, userEmail) {
        let params = {
            TableName : tableName,
            Key: {
                "Email": userEmail
            }
        };
    
        return params;
    }

    /**
     * Creates Parameter function for Dynamo updateTableEntry function to update values for User table
     * @param {String} tableName Table Name of Dynamo DB
     * @param {String} userID User Name, key for the table
     * @param {String} attrName Attribute Name of the column
     * @param {String} attrVal Attribute Value of the column
     * @returns Object
     */
    makeUpdateParamUser(tableName, userID, attrName, attrVal) {
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
     * Creates Parameter function for Dynamo updateTableEntry function to update values Product tables
     * @param {String} tableName Table Name of Dynamo DB
     * @param {String} userID User Name, key for the table
     * @param {String} attrName Attribute Name of the column
     * @param {String} attrVal Attribute Value of the column
     * @returns Object
     */
     makeUpdateParamProduct(tableName, productID, attrName, attrVal) {
        let params = {
            TableName : tableName,
            Key: {
                "ProductID": productID
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
     * @param {String} userName Seller's name
     * @param {String} userID Seller's User ID
     * @returns Object
     */
    makeProductPutParam(productID, itemCost, itemDescription, address, itemName, imageUrl, imageID, itemCategory, userName, userID) {
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
                SellerName: userName,
                Description: itemDescription,
                IsBought: "No"
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
     * Creates Parameter function for Dynamo putUserEntry function to add users upon account creation
     * @param {String} firstName First name of user
     * @param {String} lastName Last name of user
     * @param {String} email User's ucla email address
     * @param {String} phone User's phone number
     * @param {String} street User's street address
     * @param {String} password User's password
     * @param {String} userID Unique user ID
     * @returns Object
     */
     makeUserPutParam(firstName, lastName, email, phone, street, password, userID) {
        let params = {
            TableName: 'UserInformation',
            Item: {
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                PhoneNumber: phone,
                Address: street,
                Password: String(password),
                UserID: String(userID),
                ListofProductIDSelling: [],
                Wishlist: [],
                ListofProductIDSold: []
            }
        };
        return params;
    }

    /**
     * Creates Parameter function for Dynamo putUserCredEntry function to add users upon account creation
     * @param {String} email User's ucla email address
     * @param {String} password User's password
     * @param {String} userID Unique user ID
     * @returns Object
     */
    makeUserCredPutParam(email, password, userID) {
        let params = {
            TableName: 'UserCred',
            Item: {
                Email: email,
                Password: String(password),
                UserID: String(userID)
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
    getTableEntry(tableName, val) {
        let params = null;
        if (tableName == "UserInformation") {
            params = this.makeUserParam(tableName, val);
        } else if (tableName == "ProductCatalog" || tableName == "Wishlist") {
            params = this.makeProductParam(tableName, val);
        } else if (tableName == "UserCred") {
            params = this.makeUserCredParam(tableName, val);
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
        let params = null;
        if (tableName == "UserInformation") {
            params = this.makeUpdateParamUser(tableName, key, attrName, attrVal);
        } else if (tableName == "Wishlist" || tableName == "ProductCatalog"){
            params = this.makeUpdateParamProduct(tableName, key, attrName, attrVal);
        }

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
     * @param {String} itemDescription Description of the product
     * @param {String} address Address location of the product
     * @param {String} itemName Product Name
     * @param {String} imageUrl Image URL for extracting to display on pages
     * @param {String} imageID Image ID stored in S3 bucket
     * @param {String} itemCategory Category code
     * @param {String} userName Seller's name
     * @param {String} userID Seller's User ID
     * @returns Promise
     */
    putProductTableEntry(productID, itemCost, itemDescription, address, itemName, imageUrl, imageID, itemCategory, userName, userID) { 
        let params = this.makeProductPutParam(productID, itemCost, itemDescription, address, itemName, imageUrl, imageID, itemCategory, userName, userID);
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
            Key: {
                "ProductID": productID,
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

    /**
     * Put product entry into Dynamo DB UserInformation
     * @param {String} firstName First name of user
     * @param {String} lastName Last name of user
     * @param {String} email User's ucla email address
     * @param {String} phone User's phone number
     * @param {String} street User's street address
     * @param {String} password User's password
     * @param {String} userID Unique user ID
     * @returns Promise
     */
    putUserEntry(firstName, lastName, email, phone, street, password, userID) { 
        let params = this.makeUserPutParam(firstName, lastName, email, phone, street, password, userID);
        try {
            const resp = this.client.put(params).promise();
            return resp
        } catch (err) {
            console.error("Unable to put. Error:", JSON.stringify(err, null, 2));
        }
    }

    /**
     * Put product entry into Dynamo DB UserCred
     * @param {String} email User's ucla email address
     * @param {String} password User's password
     * @param {String} userID Unique user ID
     * @returns Promise
     */
    putUserCredEntry(email, password, userID) { 
        let params = this.makeUserCredPutParam(email, password, userID);
        try {
            const resp = this.client.put(params).promise();
            return resp
        } catch (err) {
            console.error("Unable to put. Error:", JSON.stringify(err, null, 2));
        }
    }

    /**
     * Scan all entries in table given table name
     * @param {String} tableName Table Name
     * @returns Promise
     */
    scanTable(tableName) {
        let params = {
            TableName: tableName
        };

        try {
            const resp = this.client.scan(params).promise();
            return resp;
        } catch (err) {
            console.error("Unable to put. Error:", JSON.stringify(err, null, 2));
        }
    }
}

