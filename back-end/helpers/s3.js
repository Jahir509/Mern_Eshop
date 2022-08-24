const aws = require('aws-sdk');
const fs = require('fs');

const region = process.env.S3_REGION
const bucketName = process.env.S3_BUCKET_NAME
const accessKeyId= process.env.S3_ACCESS_KEY
const secretAccessKey= process.env.S3_SECRET_ACCESS_KEY


const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion:'v4'
})


// uploads a file to s3
function uploadImage(file){
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise()
}

exports.uploadImage = uploadImage