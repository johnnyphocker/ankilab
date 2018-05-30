const express = require('express');
const loginRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

const User = require('../models/user');

const CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];

  return {
  	name: payload.name,
  	email: payload.email,
  	img: payload.picture,
  	google: true,
  	payload
  }

}

loginRouter.post('/google', async (req,res,next) => {

	let token = req.body.token;
	let googleUser = await verify(token)
		.catch(e => {
			return res.status(403).json({
				ok: false,
				mensaje: 'Token no válido'
			});
		});

	User.findOne({email:googleUser.email},(err,userDB) => {
		if(err) {
			return res.status(500).json({
				ok: true,
				mensaje: 'Error',
				errors: err
			})
		}

		if(userDB) {
			if(userDB.google === false) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Usar auth normal'
				});
			} else {
				let token = jwt.sign({user: userDB},SEED,{expiresIn: 86400})

				res.status(200).json({
					ok: true,
					user: userDB,
					token,
					id: userDB._id
				});
			}
		} else {
			let user = new User();
			user.name = googleUser.name;
			user.email = googleUser.email;
			user.imgProfile = googleUser.img;
			user.google = true;
			user.password = '123';

			user.save((err,userDB) => {
				let token = jwt.sign({user: userDB},SEED,{expiresIn: 86400})

				res.status(200).json({
					ok: true,
					user: userDB,
					token,
					id: userDB._id
				});
			})

		}
	})

	// res.status(200).json({
	// 	ok: true,
	// 	mensaje: 'Conectado a google',
	// 	googleUser: googleUser
	// });


});



loginRouter.post('/', (req,res,next) => {

	let body = req.body;

	User.findOne({email: body.email}, (err, userDB) => {
		if(err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al encontrar usuario',
				errors: err
			});
		}

		if(!userDB) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Credenciales incorrectas',
				errors: err
			});
		}

		if(!bcrypt.compareSync(body.password, userDB.password)) {
			return res.status(400).json({
				ok:false,
				mensaje: 'Password incorrecto',
				errors: err
			});
		}
		// userDB.password = ':)';
		let token = jwt.sign({user: userDB},SEED,{expiresIn: 86400})

		res.status(200).json({
			ok: true,
			user: userDB,
			token,
			id: userDB._id
		});
	});

});








module.exports = loginRouter;