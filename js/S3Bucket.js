/**
 * @file S3 Bucket Wrapper Class
 */
var AWS = require("aws-sdk");
var dotenv = require("dotenv");
dotenv.config();

/**
 * S3 Bucket Wrapper Class to create S3 object
 */
export class S3Bucket {
    constructor() {
        AWS.config.update({
            region: process.env.REGION,
            accessKeyId: process.env.ACCESS_ID,
            secretAccessKey: process.env.ACCESS_KEY,
            signatureVersion: 'v4'
        });
        /**
         * @property {AWS.S3} s3 S3 Object
         */
        this.s3 = new AWS.S3();
    }

    /**
     * Generate presigned URL for safe HTTP requests
     * @param {String} dir Image directory to S3 bucket
     * @returns String
     */
    generateURL(dir){
        const params = ({
            Bucket: "cs130-bucket",
            Key: dir,
            Expires: 60
        })

        const url = this.s3.getSignedUrlPromise('putObject', params);
        return url;
    }
}