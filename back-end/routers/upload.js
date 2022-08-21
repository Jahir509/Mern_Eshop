const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
})

router.get('/presign',async (req,res)=>{
    console.log(req.user);
    s3.getSignedUrl('putObject',
        {
            Bucket: 'ishop-bucket',
            ContentType:'jpeg',
            // Key:
        }
    )
})


module.exports = router;
