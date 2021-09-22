const Router = require('express').Router();
const jwt_auth =  require('../../auth/passport-jwt-middleware');
const Guest  = require('../../Models/guests');

Router.get('/', jwt_auth, (req, res) => {
    try{
        const user = req.user;
        Guest.findById(user._id)
            .select('firstName lastName email phoneNumber')
            .then(guest => res.json(guest))
    }catch (error){
        return res.status(500).json({Error: "Could not retrieve user details at this time"})
    }
})

module.exports = Router