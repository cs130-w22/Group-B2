import { S3Bucket } from "../js/S3Bucket.js"

var S3 = new S3Bucket();

jest.mock('aws-sdk', () => {
    class mockS3 {
        getSignedUrlPromise(op, obj) {
            return 'url';
        }
    }
    return {
        ...jest.requireActual('aws-sdk'),
        S3: mockS3,
    };
});

test("Calling generateURL()...", () => {
    const url = S3.generateURL("TestDir");
    expect(url).toBe("url");
})