
"use strict";
const express = require("express");
const router = express.Router();


/*********************** HANDLERS ***********************/
const handleGetEndpoint1 = async (req, res, next) => {
  try {
      let params = {
        query: req.query
      };
      console.log ("GET request without url parameters ", params);

    res.json({
        received_params: params
    });
  } catch (e) {
    next(e);
  }
};

const handlePostEndpoint1 = async (req, res, next) => {
  try {
      console.log ("POST request with body ", req.body);

    res.json({
        received_body: req.body
    });
  } catch (e) {
    next(e);
  }
};

const handleGetEndpoint1WithUrlParamter = async (req, res, next) => {
  try {
      let params = {
        url: req.params.url_parameter,
        query: req.query
      };

      console.log ("GET request with url parameters ", params);

    res.json({
      received_params: params
    });
  } catch (e) {
    next(e);
  }
};


router
    .route ("/endpoint1")
    .get(handleGetEndpoint1)
    .post(handlePostEndpoint1);

router
    .route ("/endpoint1/:url_parameter")
    .get(handleGetEndpoint1WithUrlParamter);

module.exports = router;