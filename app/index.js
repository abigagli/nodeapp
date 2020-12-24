/* eslint-disable camelcase */

'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const nocache = require('nocache');


const k_listening_port = 8333;

/*********************** HANDLERS ***********************/
const handleEndpoint1 = async (req, res, next) => {
  try {
      let params = {
        query: req.query
      };
      console.log ("Got request without url parameters ", params);

    res.json({
        received_params: params
    });
  } catch (e) {
    next(e);
  }
};

const handleEndpoint1WithUrlParamter = async (req, res, next) => {
  try {
      let params = {
        url: req.params.url_parameter,
        query: req.query
      };

      console.log ("Got request with url parameters ", params);

    res.json({
      received_params: params
    });
  } catch (e) {
    next(e);
  }
};

/*********************** PRELIMINARY ***********************/
function buildErrorJson(message) {
  return {'message': message};
}

const router = new express.Router();
const app = express();

app.use(nocache());
app.use(compression());

app.use(bodyParser.json());


/*********************** ROUTES ***********************/
app.use('/app/v1', router);
app.use('/health', (req, res) => {
  res.send();
});


router.get('/endpoint1', handleEndpoint1);
router.get('/endpoint1/:url_parameter', handleEndpoint1WithUrlParamter);


app.all('*', function(req, res) {
  res.status(404).json(buildErrorJson('Unknown request.'));
});

app.use(function(err, req, res, next) {
  console.error(err.message);
  console.error(err);
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).json(buildErrorJson(err.message)); // All HTTP requests must have a response, so let's send back an error with its status code and message
});




/*********************** KICK-OFF ***********************/
app.listen(k_listening_port, () => {
  console.log('Server running on port ' + k_listening_port);
});
