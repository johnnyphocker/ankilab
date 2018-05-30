const express = require('express');
const router  = express.Router();


router.get('/', (req, res, next) => {
  // res.render('index');
  res.status(200).json({
  	ok: true,
  	mensaje: 'Petición realizada correctamente'
  });
});

module.exports = router;
