const passport = require('passport')

const jwt_auth = (req, res, next) => {
	passport.authenticate('jwt', {session : false}, (err, user, info) => {
		if(err) {
			return res.status(500).json({Error: 'Could not authenticate user' })
		}
		if(!user){
			return res.status(401).json({Error: 'Invalid login credentials'})
		}
		next()
  	})(req, res, next);
}

module.exports = jwt_auth;