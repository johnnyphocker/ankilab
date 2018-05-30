const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mdAuth = require('../middlewares/auth');

const User = require('../models/user');


userRouter.get('/', (req,res,next) => {

	//El código de abajo sirva para paginar las búsquedas
	let desde = req.query.desde || 0;
	desde = Number(desde);

	User.find({})
	// .skip(desde)
	// .limit(2)
	.populate('deckId',{title:1,description:1,_id:0})
	.exec((err, users) => {
		if(err) {
			return res.status(500).json({
				ok:false,
				mensaje: 'Hubo un error',
				errors: err
			});
		}

		User.count({},(err, conteo) => {

			if(err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Hubo un error al contar',
					errors: err
				});
			}

			res.status(200).json({
				ok: true,
				users,
				total: conteo
			});

		});
	
	});	
});



userRouter.post('/', (req,res,next) => {

	let body = req.body;

	let salt = bcrypt.genSaltSync(10);

	let user = new User({
		name: body.name,
		email: body.email,
		password: bcrypt.hashSync(body.password, salt),
		deckId: body.deckId
	});

	user.save((err, userAdded) => {
		if(err) {
			return res.status(500).json({
				ok:false,
				mensaje: 'Hubo un error',
				errors: err
			});
		}

		res.status(201).json({
			ok: true,
			user: userAdded
		});
	});
});



userRouter.put('/:id', (req,res,next) => {

	let id = req.params.id;
	let body = req.body;

	User.findById(id, (err, userFound) => {
		if(err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Hubo un error',
				errors: err
			});
		}

		if(!userFound) {
			return res.status(404).json({
				ok: false,
				mensaje: `El usuario con el ${id} no existe`
			});
		}

		userFound.name = body.name;
		userFound.email = body.email;
		userFound.password = body.password;
		userFound.deckId = body.deckId;

		userFound.save((err,userUpdated) => {
			if(err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Hubo un error al actualizar el usuario',
					errors: err
				});
			}

			res.status(200).json({
				ok: true,
				user: userUpdated
			})
		});

	});

});

userRouter.delete('/:id', (req,res,next) => {

	let id = req.params.id;

	User.findByIdAndRemove(id, (err, userDeleted) => {

		if(err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Hubo un error',
				errors: err
			});
		}

		res.status(200).json({
			ok: true,
			user: userDeleted
		})

	})

});


module.exports = userRouter;


