const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const uuid = require('uuid').v1;


    const region = 'us-east-1'
    const accessKeyId= process.env.S3_ACCESS_KEY
    const secretAccessKey= process.env.S3_SECRET_ACCESS_KEY


const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion:'v4'

})

router.get('/presign', (req,res)=>{
    console.log(req.user); 
    const folder = req.user ? req.user._id : 'unverified'
    const key = `${folder}/${uuid()}.jpeg`
    s3.getSignedUrl('putObject',
        {
            Bucket: 'ishop-bucket',
            Key: key
        },(err,url)=>{
            res.status(200).send({
                key:key,
                url:url
            })
        }
    )
})


module.exports = router;
