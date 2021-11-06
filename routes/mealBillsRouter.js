const express = require('express');
const bodyParser = require('body-parser');
const mealBillsRouter = express.Router();
mealBillsRouter.use(bodyParser.json());

const MealsBill = require('../models/mealBills');
const User = require('../models/users');
var authenticate = require('../authenticate');
const cors = require('./cors');
const { response } = require('../app');

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


mealBillsRouter.route('/:billId')
    .options(cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
    .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
        MealsBill.findById(req.params.billId)
            .then((mealBill) => {
                if(mealBill != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(mealBill);
                }
                else{
                    const err = new Error("mealsBill not found");
                    err.status = 403;
                    return (next(err));
                }
            }, err => next(err))
                .catch(err => next(err))
    })  


    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        MealsBill.findById(req.params.billId)
            .then(mealsBill => {
                if(mealsBill != null){
                    mealsBill.findByIdAndUpdate(req.params.billId, {
                        $set: req.body
                    },{new:true})
                        .then((newBill) => {
                            MealsBill.findById(newBill._id)
                                .then((bill) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type','application/json');
                                    res.json(bill);
                                }, err => next(err))
                        }, err => next(err))
                }
            }, err => next(err))
                .catch(next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        res.end("Post operation not available")
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        MealsBill.findByIdAndDelete(req.params.billId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-type','application/json');
                res.json(response);
            }, err => next(err))
                .catch(err => next(err))
    })

module.exports = mealBillsRouter;