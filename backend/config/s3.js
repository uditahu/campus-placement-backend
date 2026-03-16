const { S3Client } = require('@aws-sdk/client-s3');

// On EC2 with an IAM role attached → no credentials needed.
// For local dev, set AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in .env
const config = { region: process.env.AWS_REGION || 'ap-south-1' };

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  config.credentials = {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const s3 = new S3Client(config);
module.exports = s3;
