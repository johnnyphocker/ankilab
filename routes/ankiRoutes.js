const express = require('express');
const ankiRoutes = express.Router();

const mdAuth = require('../middlewares/auth');

const Anki = require('../models/anki');



ankiRoutes.get('/', (req,res,next) => {

	let pages = req.query.pages || 0;
	pages = Number(pages);

	Anki.find({},{term:1,definition:1,tips:1,_id:0})
	.exec((err,anki) => {
		if(err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Hubo un error con el get',
				errors: err
			});
		}

		Anki.count({},(err, conteo) => {
			if(err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Hubo un error con el conteo',
					errors: err
				});
			}
			res.status(200).json({
				ok:true,
				anki,
				total: conteo
			});

		});

		

	});
	
});

ankiRoutes.post('/',(req,res,next) => {

	let body = req.body;

	let anki = new Anki({
		term: body.term,
		definition: body.definition,
		tips: body.tips 
	});

	anki.save((err,newAnki) => {
		if(err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'No se pudo crear anki',
				errors: err
			});
		}

		res.status(201).json({
			ok: true,
			anki: newAnki
		});
	});

});

ankiRoutes.put('/:id',(req,res,next) => {

	let id = req.params.id;
	let body = req.body;

	Anki.findById(id,(err,ankiFound) => {
		if(err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Hubo un error',
				errors: err
			});
		}

		if(!ankiFound) {
			return res.status(400).json({
				ok: false,
				mensaje: 'El anki no se encontró'
			});
		}

		ankiFound.term = body.term;
		ankiFound.definition = body.definition;
		ankiFound.tips = body.tips;

		ankiFound.save((err,ankiUpdated) => {
			if(err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Hubo un error al actualizar el anki',
					errors: err
				});
			}

			res.status(200).json({
				ok: true,
				anki: ankiUpdated
			});
		});
	});
});

ankiRoutes.delete('/:id',(req,res,next) => {

	let id = req.params.id;

	Anki.findByIdAndRemove(id,(err,ankiDeleted) => {

		if(err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Hubo un error',
				errors: err
			});
		}

		res.status(200).json({
			ok: true,
			anki: ankiDeleted
		});
	});
});







module.exports = ankiRoutes;

