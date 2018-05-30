const express = require('express');
const imgRouter = express.Router();

const app = express();

const path = require('path');
const fs = require('fs');

imgRouter.get('/:type/:img',(req,res,next) => {

	let type = req.params.type;
	let img = req.params.img;

	let pathImg = path.resolve(__dirname, `../uploads/${type}/${img}`);

	if(fs.existsSync(pathImg)) {
		res.sendFile(pathImg);
	} else {
		let noImg = path.resolve(__dirname, '../assets/img/no-img.jpg');
		res.sendFile(noImg)
	}
});






module.exports = imgRouter;