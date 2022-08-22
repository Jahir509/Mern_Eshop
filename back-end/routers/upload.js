const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const uuid = require('uuid').v1;

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
})

router.get('/presign', (req,res)=>{
    // console.log(req.user);
    const key = `users/${uuid()}.jpeg`
    s3.getSignedUrl('putObject',
        {
            Bucket: 'ishop-bucket',
            ContentType: 'jpeg',
            Key: key
        },(err,url)=>{
            res.send(url)
        }
    )
})


module.exports = router;
