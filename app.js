require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const app = express();

app.use(function(req,res,next) {
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods" , "POST, GET, PUT, DELETE, OPTIONS");
	next();
})

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://jp:juanpablo1@ds139970.mlab.com:39970/ankilab', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
});

const serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);



// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


const index = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/loginRoutes');
const deckRoutes = require('./routes/deckRoutes');
const ankiRoutes = require('./routes/ankiRoutes');
const search = require('./routes/search');
const uploadRoutes = require('./routes/upload');
const imgRoutes = require('./routes/imgRoutes');


app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/deck', deckRoutes);
app.use('/anki', ankiRoutes);
app.use('/search', search);
app.use('/upload', uploadRoutes);
app.use('/img', imgRoutes);
app.use('/', index);


module.exports = app;
