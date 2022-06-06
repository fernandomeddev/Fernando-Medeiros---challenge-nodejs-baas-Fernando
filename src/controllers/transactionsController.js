const express = require('express');
const authRole = require('../config/auth');
const router = express.Router();
const Account = require('../models/Account');
const User = require('../models/User');

router.use(authRole);

router.put('/:senderUserId', async (req, res) => {
    try {
        const {valor: balance, destinatario: email} = req.body;
        
        const userData = await User.findById(req.params.senderUserId);
        if( email === userData.email) return res.status(400).send({error: "invalid recipient"});

        const receivingEmail = await User.findOne( {email: email});
        if ( !receivingEmail ) return res.status(400).send({ error: 'recipient not found'});

        const senderData = await Account.findOne({user: req.params.senderUserId});
        if ( !senderData ) return res.status(400).send({ error:"Account not found, or not verify!" });
        if ( balance > senderData.balance ) return res.status(422).send({erro: "insufficient funds!"});
        
        const receivingAccount = await Account.findOne({ user: receivingEmail.id});
        if ( !receivingAccount ) return res.status(400).send({ error: "Accont not found!" });

        const accountSenderUpdate = await Account.findByIdAndUpdate( senderData.id, { balance:(senderData.balance - balance ) }, {new: true});
        await accountSenderUpdate.save();

        const receivingAccountUpdate = await Account.findByIdAndUpdate(receivingAccount.id, { balance: (receivingAccount.balance + balance )}, {new: true});

        await receivingAccountUpdate.save();

        const msg = `tranferencia de ${balance} R$ para ${email} realizada com sucesso!`

        return res.send({ accountSenderUpdate, msg});

    } catch (error) {
        return res.status(400).send({ error: 'Error an updating a new Project'});
    }
});

module.exports = app => app.use('/pix', router);