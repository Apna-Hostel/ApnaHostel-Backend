const express = require('express');
const bodyParser = require('body-parser');
const mealBillsRouter = express.Router();
mealBillsRouter.use(bodyParser.json());

const MealsBill = require('../models/mealBills');
const User = require('../models/users');
var authenticate = require('../authenticate');
const cors = require('./cors');

mealBillsRouter.route('/')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200)})
.get(cors.cors, authenticate.verifyUser, (req,res,next) =>{
    MealsBill.find({hostel:req.user.hostel})
        .populate('hostel')
        .then((mealsBill) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(mealsBill);
        }, err => next(err))
            .catch(err => next(err))
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.end('Put request is not supported on the /mealsBill end point');
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    req.body.hostel = req.user.hostel;
    MealsBill.create(req.body)
        .then((mealsBill) => {
            MealsBill.findById(mealsBill._id)
                .populate('hostel')
                .then((mealsBill) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(mealsBill);
                })
        }, err => next(err))
            .catch(err => next(err))

})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    MealsBill.deleteMany({hostel:req.user.hostel})
        .then((response) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(response);
        }, (err => next(err)))
})


module.exports = mealBillsRouter;