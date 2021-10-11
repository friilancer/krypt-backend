const Guest  = require('../Models/guests');

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const options = {}

options.jwtFromRequest = ExtractJwt.fromHeader('auth_token');
options.secretOrKey = process.env.JWT_SECRET;
options.ignoreExpiration = false

module.exports = (passport) => {
	passport.use(
		new JWTStrategy(options, (jwt_payload, done) => {
			Guest.findById(jwt_payload.id)
				.then(guest => {
				if(guest){
					return done(null, guest)
				}else{
					return done(null, false, {Error: 'User does not exist'})
				}
			}).catch(err => {
				console.log(err)
			})
		})
	)
}
