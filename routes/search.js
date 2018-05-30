const express = require('express');
const search = express.Router();

const User = require('../models/user');
const Deck = require('../models/deck');
const Anki = require('../models/anki');

search.get('/collection/:table/:search',(req,res,next) => {
	
	let search = req.params.search;
	let table = req.params.table;
	let regex = new RegExp(search, 'i');

	let promise;

	switch(table) {
		case 'user':
		promise = searchUser(search, regex);
		break;

		case 'deck':
		promise = searchDeck(search, regex);
		break;

		default:
		return res.status(400).json({
			ok: false,
			mensaje: 'El tipo de búsqueda no es reconocido'
		});
	}

	promise.then(data => {
		res.status(200).json({
			ok: true,
			[table]: data
		});
	});

});


search.get('/all/:search',(req,res,next) => {

	let search = req.params.search;
	let regex = new RegExp(search, 'i');

	Promise.all([searchUser(search, regex), searchDeck(search, regex)])
		.then(resp => {
			res.status(200).json({
				ok: true,
				user: resp[0],
				deck: resp[1]
			});
		});
	
});

function searchUser(search, regex) {

	return new Promise((resolve, reject) => {

		User.find({name: regex},{name:1,email:1,_id:0})
		.populate('deckId')
		.exec((err,user) => {
			if(err) {
				reject('Error al cargar usuarios', err)
			} else {
				resolve(user)
			}

		}).catch(e => console.log(e));

	});

}

function searchDeck(search, regex) {

	return new Promise((resolve, reject) => {

		Deck.find({$or: [{'title': regex},{'description': regex}]})
		.populate('ankiId',{title:1,_id:1})
		.exec((err,deck) => {
			if(err) {
				reject('Error al cargar usuarios', err)
			} else {
				resolve(deck)
			}

		}).catch(e => console.log(e));

	});

}







module.exports = search;