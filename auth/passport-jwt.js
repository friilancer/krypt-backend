const Guest  = require('../Models/guests');
const bcrypt = require('bcryptjs');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const options = {}

options.jwtFromRequest = ExtractJwt.fromHeader('auth_token');
options.secretOrKey = process.env.JWT_SECRET;
options.ignoreExpiration = false

module.exports = (passport) => {
	passport.use(
		new JWTStrategy(options, (jwt_payload, done) => {
			Guest.findOne({id: jwt_payload.sub})
				.select('firstName')
				.then(guest => {
				if(!guest){
					return done(null, false, {Error: 'User does not exist'})
				}
				return done(null, guest)
			}).catch(err => {
				console.log(err)
			})
		})
	)
}
