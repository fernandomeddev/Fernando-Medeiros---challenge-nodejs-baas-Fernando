const express = require("express");

require('dotenv');
const authSecret = process.env.SECRET

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authSecret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) => {
    try {
        const { email, password, confirmPassword, isAdmin="false" } = req.body;
        
        if ( await User.findOne({ email }))
            return res.status(400).send({error: 'User already exists'});

        if ( password !== confirmPassword)
            return res.status(422).send({error: "passwords do not match"});
    
        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });
    } catch (error) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});


router.post('/authenticate', async (req, res) => {
    const {email, password } = req.body;

    const user = await User.findOne({ email }).select('+password')

    if (!user) 
        return res.status(400).send({ error: 'User not found!'})

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({erro: 'Invalid password'})

    user.password = undefined;

    const token = jwt.sign({ id: user.id }, authSecret, {
        expiresIn: 86400,
    });

    res.send({ 
        user, 
        token: generateToken({ id: user.id }),
    });
});

module.exports = app => app.use('/auth', router);
