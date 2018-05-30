
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

exports.verifyToken = function(req,res,next) {

	let token = req.query.token;
	jwt.verify(token,SEED,(err,decoded) => {
		if(err) {
			return res.status(401).json({
				ok: false,
				mensaje: 'Hubo un error con el token',
				errors: err
			});
		}

		// res.status(200).json({
		// 	ok:true,
		// 	decoded
		// });

		next();

	});

}






