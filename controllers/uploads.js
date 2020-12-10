const AWS = require("aws-sdk");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const errors = require("../constants/errors");
require("dotenv/config");

const s3 = new AWS.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: "ap-northeast-2",
});

// Handle uploading stuff
exports.getUrl = catchAsync(async (req, res) => {
    try {
        const currentDate = new Date();
        const key = `${currentDate.getTime()}.${req.body.type}`;
        s3.getSignedUrl(
            "putObject",
            {
                Bucket: "anime.uz",
                ContentType: `${req.body.contentType}`,
                Key: key,
            },
            (err, url) => {
                if (err) {
                    return res
                        .status(400)
                        .json({ success: false, message: err.message });
                }
                res.status(200).json({ success: true, url: url, key: key });
            }
        );
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
