const express = require('express');
const deckRoutes = express.Router();

const mdAuth = require('../middlewares/auth');

const Deck = require('../models/deck');


deckRoutes.get('/',(req,res,next) => {

	// let pages = req.query.pages || 0;
	// pages = Number(pages);

	Deck.find({})
	.populate('ankiId')
	.exec((err,deck) => {
		if(err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Hubo un error al iniciar el get',
				errors: err
			});
		}

		Deck.count({},(err, conteo) => {

			if(err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Hubo un error al contar',
					errors: err
				});
			}

			res.status(200).json({
				ok: true,
				deck,
				total: conteo
			});

		});

	});
});

deckRoutes.post('/', (req,res,next) => {
	let body = req.body;

	let deck = new Deck({
		title: body.title,
		description: body.description,
		category: body.category,
		tag: body.tag,
		ankiId: body.ankiId
	});

	deck.save((err,newDeck) => {
		if(err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'No se pudo crear deck',
				errors: err
			});
		}

		res.status(201).json({
			ok: true,
			deck: newDeck
		});
	});
});

deckRoutes.put('/:id', (req,res,next) => {
	let id = req.params.id;
	let body = req.body;

	Deck.findById(id, (err, deckFound) => {
		if(err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Hubo un error',
				errors: err
			});
		}

		if(!deckFound) {
			return res.status(400).json({
				ok: false,
				mensaje: 'El deck no se encontró'
			});
		}

		deckFound.title = body.title;
		deckFound.description = body.description;
		deckFound.tag = body.tag;
		deckFound.category = body.category;
		deckFound.ankiId = body.ankiId;

		deckFound.save((err,deckUpdated) => {
			if(err) {
				return res.status(400).json({
					ok: false,
					mensaje: 'Hubo un error al actualizar el deck',
					errors: err
				});
			}

			res.status(200).json({
				ok: true,
				deck: deckUpdated
			});
		});

	});
});

deckRoutes.delete('/:id',(req,res,next) => {

	let id = req.params.id;

	Deck.findByIdAndRemove(id,(err,deckDeleted) => {
		if(err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Hubo un error',
				errors: err
			});
		}

		res.status(200).json({
			ok: true,
			deck: deckDeleted
		});

	});

});

deckRoutes.get('/:id',(req,res,next) => {

	let id = req.params.id;
	Deck.findById(id)
		.populate('ankiId','term definition tips')
		.exec((err, deck) => {
			if(err) {
				return res.status(500).json({
					ok: false,
					mensaje: 'Error al buscar deck',
					errors: err
				});
			}
			if(!deck) {
				return res.status(400).json({
					ok: false,
					mensaje: 'No existe el deck'
				});
			}
			res.status(200).json({
				ok: true,
				deck: deck
			});
		})

});







module.exports = deckRoutes;
