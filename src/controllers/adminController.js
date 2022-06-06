const express = require('express');
const authRole = require('../config/auth');
const Account = require('../models/Account');
const User = require('../models/User');
const File = require('../models/File');

const router = express.Router();

router.use(authRole);


router.get('/:userId', async (req, res) => {
    try {
        
        const user = await User.findById(req.params.userId);

        if(!user) return res.status(401).send({ error: 'user not exists'})
            const users = await User.find();

        return res.send({ user});
    } catch (error) {
        return res.status(400).send({ error: 'Error an loading accounts'});
    }
});

router.put('/:userId/update', async (req, res) => {
    try {
        const { name, email, isAdmin } = req.body
        
        const emailInvalid = await User.findOne({ email });
        if ( emailInvalid) return res.status(400).send({error: 'User already exists'});

        const userEdited = await User.findByIdAndUpdate(req.params.userId, {name: name, email: email, isAdmin: isAdmin}, {new: true});

        await userEdited.save();

        return res.send({  user });
    } catch (error) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});

router.delete('/delete/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if(!user) return res.status(401).send({ error: 'user not exists'})
            const users = await User.find();

        return res.send({ msg: "user deleted!" });
    } catch (error) {
        return res.status(400).send({ error: 'Error an delete process'});
    }
});
router.get('/:adminId/allusers', async (req, res) => {
    try {
        
        const user = await User.findById(req.params.adminId);

        if(!user.isAdmin) return res.status(401).send({ error: 'acess deined!'})
            const users = await User.find();

        return res.send({ users });
    } catch (error) {
        return res.status(400).send({ error: 'Error an loading accounts'});
    }
});

router.get('/:adminId/allusers/verified', async (req, res) => {
    try {
        const user = await User.findById(req.params.adminId);
        if(!user.isAdmin) return res.status(401).send({ error: 'acess deined!'})

        const files = await File.find().populate(["user"]);

        return res.send({ files });
    } catch (error) {
        return res.status(422).send({ error: 'bad request'});
    }  
});

router.get('/:adminId/account', async (req, res) => {
    try {

        const user = await User.findById(req.params.adminId);

        if(!user.isAdmin) return res.status(401).send({ error: 'acess deined!'});

        const account = await Account.find().populate('user');

        return res.send({ account });
    } catch (error) {
        return res.status(400).send({ error: 'Error an loading accounts'});
    }
});

router.get('/:accountId', async (req, res) => {
    try {
        const accountData = await Account.findById(req.params.accountId);
        if(!accountData) return res.status(400).send({ error:"Account not found, or not verify!" });

        return res.json(accountData);
    } catch (error) {
        return res.json(error)
    }
});

router.delete('/:accountId', async (req, res) => {
    try {
        const accountData = await Account.findByIdAndDelete(req.params.accountId);
        if(!accountData) return res.status(400).send({ error:"Account not found, or not verify!" });

        return res.send({ msg: "account deleted!"});
    } catch (error) {
        return res.json(error)
    }
});

router.put('/:accountId/update/', async (req, res) => {
    try {
        const { valor: balance } = req.body;

        const accountData = await Account.findByIdAndUpdate(req.params.accountId, {balance: balance}, {new: true});

        await accountData.save();

        if(!accountData) return res.status(400).send({ error:"Account not found, or not verify!" });

        

        return res.send(accountData);
    } catch (error) {
        return res.json(error)
    }
});

router.post('/:adminId/create/account', async (req, res) => {

    try {

        const { accountName, balance, accountOwner } = req.body;

        const user = await User.findById({ _id: accountOwner });
        if(!user) return res.status(400).send({ error: 'User not exists'});
        
        const file = await File.findOne({ user: accountOwner })
        
        const accountAlreadyExists = await Account.findOne({ user: accountOwner });
        if (accountAlreadyExists) return res.status(400).send({ error: 'account already exists!'});
        if ( !balance || balance <= 0 ) return res.status(400).send({ error: 'you need inform a initial balance'})

        const account = await Account.create({ accountName, balance, user:accountOwner });

        await account.save();

        return res.send({ account });
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: 'Error an Create a new account'});
    }
});

module.exports = app => app.use('/admin', router);