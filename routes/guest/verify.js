const Router = require('express').Router();
const jwt_auth =  require('../../auth/passport-jwt-middleware');
const Guest  = require('../../Models/guests');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');


Router.get('/', jwt_auth, (req, res) => {
    try{
        const user = req.user;
        Guest.findById(user.id)
            .select('firstName lastName email')
            .then(guest => res.json(guest))
    }catch (error){
        return res.status(500).json({errorMessage: "Could not retrieve user details at this time"})
    }
})

Router.post('/googleUser', async (req, res) => {
    let {token} = req.body
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,  
        });
        const payload = ticket.getPayload();
        let {email, given_name, family_name} = payload

        let user = await Guest.findOne({email});
        if(user){			
			let jwtToken = await jwt.sign(
				{id: user.id},
				process.env.JWT_SECRET,
				{expiresIn : '7d'}
            )
			
            return res.json({
					token:jwtToken,
					user:{
						id:user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						phoneNumber: user.phoneNumber,
						email: user.email,
					}
				})
			
        }else{
            const newGuest = new Guest({
				firstName:given_name,
				lastName:family_name,
				email
			})

            let savedGuest = await newGuest.save();
            let jwtToken = await jwt.sign(
                {id: savedGuest.id},
                process.env.JWT_SECRET,
                {expiresIn : '7d'}
            )

            return res.json({
                token: jwtToken,
                user:{
                    id:savedGuest.id,
                    firstName: savedGuest.firstName,
                    lastName: savedGuest.lastName,
                    phoneNumber: savedGuest.phoneNumber ? savedGuest.phoneNumber : '',
                    email: savedGuest.email,
                }
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({errorMessage: 'Could not verify google user'})
    }
})


module.exports = Router