const express = require('express');
const authMiddleware = require('../config/auth');
const multer = require('multer');
const multerConfig = require('../config/multer');
const router = express.Router();
router.use(authMiddleware);

const User = require('../models/User');
const File = require('../models/File');

router.get('/', async (req, res) => {
    
    try {
        
        const files = await File.find().populate(['user']);

        return res.send({ files });
    } catch (error) {
        return res.status(400).send({ error: 'Error an loading projects'});
    }
});


router.get("/:userEmail", async (req, res) => {

    try {
        const user = await User.findOne({ email: req.params.userEmail});
        if (!user ) return res.status(422).send({ error: "user not found!"});

        const docsByUser = await File.find( { user: user.id });
        if (!docsByUser) return res.status(400).send({ error: 'user do not have a docs Image'}) 

        return res.send({ docsByUser })

    } catch (error) {
        
    }
})

router.delete("/remove/:fileId", async (req, res) => {

    try {
        const docImage = await File.findByIdAndDelete( { _id: req.params.fileId });
        if (!docImage) return res.status(400).send({ error: 'document not found'}) 

        return res.send({ msg: 'document deleted!!!' })

    } catch (error) {
        return res.status(400).send({error: "Error an Deleting process!"})
    }
})


router.post("/:userId", multer(multerConfig).single("file"), async (req, res) => {

    try {

        const currentUser = await User.findById(req.params.userId);
        if (!currentUser ) return res.status(422).send({ error: "bad request"});

        const { originalname: name, size, key, location: url = "" } = req.file;

        const fileDoc = await File.create({
            name,
            size,
            key,
            user: currentUser.id,
            url,
        });

        return res.json(fileDoc);
    } catch (error) {
        return res.status(400).send({ error: "Error in document uploading process" })
    }
});



module.exports = app => app.use('/uploadfile', router);