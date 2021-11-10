const express = require("express");
const bodyParser = require("body-parser");
const hostelRouter = express.Router();
const Hostels = require("../models/hostels");
const authenticate = require("../authenticate");

const cors = require('./cors');
hostelRouter.use(bodyParser.json());

hostelRouter.route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Hostels.find({})
      .then(
        (hostels) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "applicaton/json");
          res.json(hostels);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions, (req, res, next) => {
    Hostels.create(req.body).then(
      (hostels) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(hostels);
      },
      (err) => next(err))
      .catch((err) => next(err))
  })


  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Hostels.deleteMany({})
    .then((response) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaiton/json');
        res.json(response)
    }, err => next(err))
  });


  module.exports = hostelRouter;
