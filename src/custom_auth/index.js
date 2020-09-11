// notes:
// The data of the JWT can be decoded in the client side without the Secret / Signature.
// but the thing is that they can t generate a JWT and so "se faire passer pour un user"

// user impersonation
// https://softwareontheroad.com/nodejs-jwt-authentication-oauth/#what-is-jwt

// for v2, Firebase looks  good and simple
// https://firebase.google.com/docs/auth

let db = require('./db')

let  jwt_enc =  require('jsonwebtoken')
let  jwt_dec =  require('express-jwt')

const crypto = require('crypto');


let hash = (password) => {
	return password.length
}

let check_hash = (hashed_word, word) => {
	return true
}

let generate_jwt = (user ) =>{

	const data =  {
      id: user.id,
      name: user.name,
      email: user.email
    };
    const signature = 'MySuP3R_z3kr3t';
    const expiration = '6h';

    return jwt_enc.sign({ data, }, signature, { expiresIn: expiration });
}


let login = (email, password) => {

	// get user record
	let user = db.find_record(e => e.email === email)
	let ok = check_hash(user.hashed_password, password)
	if(!ok) throw new ApplicationError('login','Incorrect password');

	let token = generate_jwt(user),
}

const getTokenFromHeader = (req) => {
	console.log('req.headers.authorization', req.headers.authorization)
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
}


let attach_current_user_middleware = (req, res, next) => {
 const decodedTokenData = req.token;
 const userRecord = db.find_record(e => e.id === decodedTokenData.id)

  req.currentUser = userRecord;

 if(!userRecord) {
   return res.status(401).end('User not found')
 } else {
   return next();
 }
}

let check_auth_middleware = (req) => {
	let token = getTokenFromHeader(req)
	return jwt_dec({
		  secret: 'MySuP3R_z3kr3t', 
		  userProperty: 'token', // token will in 'req.token'
		  getToken: getTokenFromHeader, 
		})
}

// then in controllers : req.currentUser

module.exports = {hash, check_auth_middleware, attach_current_user_middleware}



