const express = require('express');
const uploadRoutes = express.Router();
const fileUpload = require('express-fileupload');
const app = express();
const multer  = require('multer');
const fs = require('fs');

const User = require('../models/user');

app.use(fileUpload());

app.put('/:type/:id',(req,res,next) => {

	let type = req.params.type;
	let id = req.params.id;

	if(!req.files) {
		return res.status(400).json({
			ok: false,
			mensaje: 'No hay archivos para subir'
		});
	}

	let file = req.files.img;
	let fileSplit = file.name.split('.');
	let fileExt = fileSplit[fileSplit.length - 1];
	let validExt = ['png','jpg','gif','jpeg','svg'];
	let validTypes = ['profile','cover'];

	if(validTypes.indexOf(type) < 0) {
		return res.status(400).json({
			ok: false,
			mensaje: 'Tipo de colección no válida'
		})
	}

	if(validExt.indexOf(fileExt) < 0) {
		return res.status(400).json({
			ok: false,
			mensaje: 'Extensión no válidad'
		});
	}

	let fileName = `${id}-${new Date().getMilliseconds()}.${fileExt}`;
	let path = `./uploads/${type}/${fileName}`;

	file.mv(path, err => {
		if(err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al mover archivo',
				errors: err
			});
		}

		uploadByType(type, id, fileName, res);

		
	})


	res.status(200).json({
		ok: true,
		mensaje: 'Archivo subido satisfactoriamente'
	});

});


function uploadByType(type, id, fileName, res) {

	if(type === 'profile') {
		User.findById(id, (err,user) => {
			
			let oldPath = './uploads/profile' + user.imgProfile;

			if(fs.existsSync(oldPath)) {
				fs.unlink(oldPath);
			}

			user.imgProfile = fileName;

			user.save((err,userUpdated) => {

				if(err) {
					return res.status(400).json({
						ok: false,
						mensaje: 'Hubo un error'
					});
				}

				return res.status(200).json({
					ok: true,
					mensaje: 'Archivo movido correctamente',
					user: userUpdated
				})

			})


		});
	}

	if(type === 'cover') {
		User.findById(id, (err,user) => {
			
			let oldPath = './uploads/cover' + user.imgCover;

			if(fs.existsSync(oldPath)) {
				fs.unlink(oldPath);
			}

			user.imgCover = fileName;

			user.save((err,userUpdated) => {

				if(err) {
					return res.status(400).json({
						ok: false,
						mensaje: 'Hubo un error'
					});
				}

				return res.status(200).json({
					ok: true,
					mensaje: 'Archivo movido correctamente',
					user: userUpdated
				})

			})


		});
	}

}



module.exports = app;
