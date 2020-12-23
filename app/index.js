/* eslint-disable camelcase */

'use strict';
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();
//const nocache = require('nocache');


const k_listening_port = 8333;

/*********************** HANDLERS ***********************/
const handleEndpoint1 = async (req, res, next) => {
  try {
      console.log ("Got request without url parameters");

    res.json({
        some_key: "some_value"
    });
  } catch (e) {
    next(e);
  }
};

const handleEndpoint1WithUrlParamter = async (req, res, next) => {
  try {
      let params = {
        url: req.params.url_parameter,
        req: req.query.req_parameter
      };

      console.log ("Got request with url parameters %j", params);

    res.json({
      received_params: params
    });
  } catch (e) {
    next(e);
  }
};

/*********************** UTILS ***********************/
function buildErrorJson(message) {
  return {'message': message};
}

const corsOptions = {
  origin: 'http://localhost' + ':' + k_listening_port,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

/*********************** ROUTES ***********************/
const router = new express.Router();

//app.use(nocache());
app.use(compression());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
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
