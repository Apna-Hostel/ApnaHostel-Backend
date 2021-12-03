const express = require('express');
const bodyParser = require('body-parser');
const mealsRouter = express.Router();
mealsRouter.use(bodyParser.json());
const Meals = require('../models/meals');
const User = require('..models/user');
var authenticate = require('../authenticate');
const cors = require('./cors');


mealsRouter.route('/')
    .options(cors.corsWithOptions, (req,res) => {res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
        Meals.find({hostel:req.user.hostel})
            .then(meals => {
                res.statusCode=200;
                res.setHeader('Content-type','application/json');
                res.json(meals);
            }, err => next(err))
            .catch(err => next(err))
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        res.end('Put request not supported on the meals end point')
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        req.body.hostel = req.user.hostel;
        Meals.create(req.body)
            .then(meals => {
                Meals.findById(meals._id)
                    .populate('hostel')
                    .then(meals => {
                        res.statusCode=200;
                        res.setHeader('Content-type','applicaiton/json');
                        res.json(meals);
                    }, err => next(err))
                    .catch(err => next(err))
            })
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        Meals.deleteMany({hostel:req.user.hostel})
            .then(response => {
                res.statusCode=200;
                res.setHeader('Content-type','application/json');
                res.json(response);
            }, err => next(err))
    })

mealsRouter.route('/:mealId')
    .options(cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
    .get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        
    })