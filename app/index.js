/* eslint-disable camelcase */
'use strict';



const handleEndpoint1 = async (req, res, next) => {
  try {
      console.log ("Got request with parameter " + req.some_parameter);

    res.json({
      somekey: "somevalue",
    });
  } catch (e) {
    next(e);
  }
};

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();
const nocache = require('nocache');

// INfrastructuralParameters
const INP_listeningPort = 3333;

function buildErrorJson(message) {
  return {'message': message};
}

const corsOptions = {
  origin: 'http://localhost' + ':' + INP_listeningPort,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const router = new express.Router();


app.use(nocache());
app.use(compression());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use('/node/app/v1', router);
app.use('/health', (req, res) => {
  res.send();
});


router.get('/endpoint1/:some_parameter', handleEndpoint1);


app.all('*', function(req, res) {
  res.status(404).json(buildErrorJson('Unknown request.'));
});

app.use(function(err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  console.error(err);
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).json(buildErrorJson(err.message)); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

app.listen(INP_listeningPort, () => {
  console.log('Server running on port ' + INP_listeningPort);
});

