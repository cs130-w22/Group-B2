var AWS = require("aws-sdk");
var dotenv = require("dotenv");
dotenv.config();

export class S3Bucket {
    constructor() {
        AWS.config.update({
            region: process.env.REGION,
            accessKeyId: process.env.ACCESS_ID,
            secretAccessKey: process.env.ACCESS_KEY,
            signatureVersion: 'v4'
        });
        this.s3 = new AWS.S3();
    }

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