var path = require('path'),  
    express = require('express'), 
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    listingsRouter = require('../routes/listings.server.routes'), 
    getCoordinates = require('../controllers/coordinates.server.controller.js');

var homepage = {
  index: "index.html"
}

module.exports.init = function() {
  //connect to database
  mongoose.connect(config.db.uri);

  //initialize app
  var app = express();

  //enable request logging for development debugging
  app.use(morgan('dev'));

  //body parsing middleware 
  app.use(bodyParser.json());

  /* server wrapper around Google Maps API to get latitude + longitude coordinates from address */
  app.post('/api/coordinates', getCoordinates, function(req, res) {
    res.send(req.results);
  });

  /* serve static files */
  // Static files content doesn't change, go to client directory
  // dirname -> filepath of current folder
  app.use('/', express.static(path.join(__dirname, '../../client')));

  /* use the listings router for requests to the api */
  // Use the listings router for requests going to the /api/listings path
  app.use('/api/listings', listingsRouter);

  /* go to homepage for all routes not specified */
  // direct users to the client side index.html file for requests to any other path
  app.use('/', express.static('app', homepage));

  return app;
};  