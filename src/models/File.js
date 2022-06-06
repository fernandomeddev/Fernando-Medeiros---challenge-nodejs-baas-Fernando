require('dotenv');
const mongoose = require('mongoose');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');


const s3 = new aws.S3();

const FileSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
    url: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    createdAt: {
        type:Date,
        default: Date.now
    },
});

FileSchema.pre('save', function(){
    if ( !this.url ) {
        this.url = `${process.env.APP_URL}/files/${this.key}`
    }
});

FileSchema.pre("remove", function() {
    if (process.env.STORAGE_TYPE == 's3') {
        return s3.deleteObject({
            Bucket: process.env.BUCKET,
            Key: this.key,
        }).promise();
    }else {
        return promisify(fs.unlink)(path.resolve(__dirname, '..', 'tmp', 'uploads', this.key));
    }
    
});


const File = mongoose.model("File", FileSchema);

module.exports = File;