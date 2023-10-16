// aws-user-secret E9lZGP2GMFevYVgDrBDVF3+28yJwPX9kN5OrhzQt , TT31qWLZDtt2jaKcaLca2j9DhgioHm83R72CsCsA, yhoKcxYJWuLs7u7osS4E3MkcpMS9lA6JCmhWLo9f
// access key AKIAZ7CUZWKHR4EAX44K ,  AKIAZ7CUZWKH3WDLSEGM, AKIATHMZ4BURI3Z4GNMN

// 1. created a bucket - storage for application - learn-flow-resource-bucket
// 2. created a CDN using cloudfront - used to view/read any object inside the bucket
// 3. Policy -set of permission - defines that anyone to whome this policy is attatched, they will have access to this bucket
// 4. user - set of credentials / application to which policies are attatched

const {S3Client,PutObjectCommand} = require('@aws-sdk/client-s3')
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner')

const express = require('express')

// const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
const { ensureAuth } = require("../middleware/auth");
// const { awsAccessKeyID, awsSecretAccessKey } = require("../config/keys");

const router = express.Router();

const bucket = new S3Client({
  
  region: "ap-south-1",
  credentials:{
    accessKeyId: 'AKIATHMZ4BURI3Z4GNMN',
  secretAccessKey: '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',
  }
  
});

const getPresignedUrl = async (fileName,contentType) => {

    // const fileName = "DP.jpg"

    const command = new PutObjectCommand({
        Bucket:"bucket-for-profilepic-learnflow",
        Key:fileName,
        ContentType:contentType
    })

    const url = await getSignedUrl(bucket,command,{expiresIn:3600})
    console.log("presigned url = ",url)
    return url
}


router.get("/video", (req, res) => {
  console.log("Here");
  const range = req.headers.range;
  const params = {
    Bucket: "my-video-bucket-123",
    Key: "Placewit - WebD English (2023-02-26 11_16 GMT 5_30).mp4",
  };

  s3.headObject(params, (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    const fileSize = data.ContentLength;
    console.log(fileSize);

    const chunkSize = 1 * 1e6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, fileSize - 1);
    const contentLength = end - start + 1;

    const readStream = s3
      .getObject({
        ...params,
        Range: `bytes=${start}-${end}`,
      })
      .createReadStream();
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    });

    readStream.pipe(res);
  });
});

router.get("/", ensureAuth, async (req, res) => {
  const contentType = req.query.contentType;
  const user = req.user;
  console.log(contentType);
  const fileName =
    user.googleID +
    "/" +
    req.query.fileName.split(".")[0] +
    uuid() +
    "." +
    contentType.split("/")[1];

  console.log(fileName);

  const url = await s3.getSignedUrl("putObject", {
    Bucket: "my-video-bucket-123",
    ContentType: contentType,
    Key: fileName,
  });

  res.json({
    url,
    key: fileName,
  });
});

router.get('/presignedUrl', async(req,res)=>{

    const filename = req.query.filename.split('.')[0] + '-' + uuid() + '.'+ req.query.contenttype.split('/')[1]
    // console.log(filename)
    const contenttype = req.query.contenttype
    // console.log(filename)
    const url= await getPresignedUrl(filename,contenttype)
    // console.log(url)
    res.send({
        url:url,

        filename:filename
    })
})

module.exports = router;