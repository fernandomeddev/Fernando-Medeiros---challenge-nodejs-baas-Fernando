const User = require("../models/User");


module.exports = async (req, res, next) => {
    
    const user = await User.findById(req.params.adminId);

    if(!user.isAdmin) return res.status(401).send({ error: 'acess deined!'})

    return next();
}