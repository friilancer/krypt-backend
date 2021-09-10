const Guest  = require('../../Models/guests');
const Router = require('express').Router();
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

Router.post('/', (req, res) => {
	const {email, password} = req.body;

	if(!email || !password) return res.status(400).json({ Error : 'Please enter all fields'});

	Guest.findOne({email}).then(guest => {
		if(!guest){
			return res.status(400).json({Error: 'User does not exist'})
		}

		bcrypt.compare(password, guest.password).then(isMatch => {
			if(!isMatch){
				return res.status(400).json({Error: 'User credentials do not match'})
			}
			jwt.sign(
				{id: guest.id},
				process.env.JWT_SECRET,
				{expiresIn : 864000},
				(err, token) => {
					if(err){
						return res.status(500).json({Error: 'Server could not create token'})
					}

					return res.json({
						token,
						user:{
							id:guest.id,
							firstName: guest.firstName,
							lastName: guest.lastName,
							phoneNumber: guest.phoneNumber,
							email: guest.email,
						}
					})
				}
			)
		})
	})
})

module.exports = Router;