const Guest  = require('../../Models/guests');
const bcrypt = require('bcryptjs');
const Router = require('express').Router();
const jwt = require('jsonwebtoken');


Router.post('/', (req, res) => {
	try{
		const {firstName, lastName, email, phoneNumber, password } = req.body;

		if(!firstName || !lastName || !email || !phoneNumber || !password){
			res.status(400).json({Error: 'Please fill in all fields'})
		}

		Guest.findOne({$or: [{phoneNumber}, {email}]}).then(guest => {
			if(guest){
				return res.status(400).json({Error: 'User already exists'})
			}

			const newGuest = new Guest({
				firstName,
				lastName,
				email,
				phoneNumber,
				password
			})

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newGuest.password, salt, (err, hash) => {
					if(err){
						return res.status(500).json({Error: 'Could not complete user registration'})
					}
					newGuest.password = hash;
					newGuest.save().then(guest => {
						jwt.sign(
							{id: guest.id},
							process.env.JWT_SECRET,
							{expiresIn : 3600},
							(err, token) => {
								if(err){
									return res.status(500).json({Error: 'Server could not create token'})
								}

								return res.json({
									token,
									user:{
										id:guest.id,
										firstName: guest.firstName
									}
								})
							}
						)
					})

				})
			})
		})
	}catch(error){
		if(error){
			return res.status(500).json({Error: 'Could not complete user registration'})
		}
	}
})

module.exports = Router;