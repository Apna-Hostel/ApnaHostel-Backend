const express = require('express');
const bodyParser = require('body-parser');
const requestRouter = express.Router();
requestRouter.use(bodyParser.json());
const Requests = require('../models/requests');
const User = require('../models/users');
var authenticate = require('../authenticate');
const cors = require('./cors');

requestRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        console.log(req.user.hostel);
        Requests.find({ hostel: req.user.hostel })
            .populate('hostelName')
            .then((requests) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(requests);
            }, err => next(err))
            .catch(err => next(err))
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.end('put request not valid on the /students end point')
    })

    .post(cors.corsWithOptions, (req, res, next) => {
        Requests.create(req.body)
            .then((request) => {
                Requests.findById(request._id)
                    .then((request) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(request)
                    }, (err) => next(err))


            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Requests.deleteMany({ hostel: req.user.hostel })
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err))
    })

requestRouter.route('/:requestId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Requests.findById(req.params.requestId)
            .then((request) => {
                if (request != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(request);
                } else {
                    const err = new Error("student not found");
                    err.status = 403;
                    return (next(err));
                }
            }, (err) => next(err))
            .catch(err => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Requests.findById(req.params.requestId)
            .then((request) => {
                if (request != null) {
                    console.log('hello');
                    Requests.findByIdAndUpdate(req.params.requestId, {
                        $set: req.body
                    }, { new: true })
                        .then((newRequest) => {
                            Requests.findById(newRequest._id)
                                .then((request) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    res.json(request);
                                }, err => next(err))
                        }, err => next(err))
                }
            }, err => next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.end('post operations not available')
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Requests.findByIdAndDelete(req.params.requestId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(response);
            }, err => next(err))
    })

module.exports = requestRouter;