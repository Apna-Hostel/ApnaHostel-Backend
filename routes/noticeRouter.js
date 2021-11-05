const express = require('express');
const bodyParser = require('body-parser');

const noticeRouter = express.Router();
noticeRouter.use(bodyParser.json());

var authenticate = require('../authenticate');
const cors = require('./cors');
const Notices = require('../models/notices')

noticeRouter.route('/')
    .options(cors.corsWithOptions, (req,res) => { res.sendStatus(200)})    
    .get(cors.cors, authenticate.verifyUser, (req,res,next) =>{
        Notices.find({hostel: req.user.hostel})
            .populate('hostel')
                .then((notices) =>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(notices);
                }, err => next(err))
                .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
        req.body.hostel = req.user.hostel;
        Notices.create(req.body)
            .then((notice) =>{
                Notices.findById(notice._id)
                    .populate('hostel')
                        .then((notice) =>{
                            res.statusCode=200;
                            res.setHeader('Content-type','application/json')
                            res.json(notice)
                        }, err => next(err))
                        .catch(err => next(err))
            })
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        res.statusCode=403;
        res.end('PUT operation not supported on the notices route');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
        Notices.deleteMany({hostel: req.user.hostel})
            .then((response) => {
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(response);
            }, err => next(err))
    })

noticeRouter.route('/:noticeId')
    .options(cors.corsWithOptions,  (req,res) =>{ res.sendStatus(200)})
    .get(cors.cors, authenticate.verifyUser, (req,res,next) =>{
        res.statusCode=403;
        res.end(`Get operation not supported on /${req.params.noticeId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
        res.statusCode = 403;
        res.end(`Post operation not supported on /${req.params.noticeId}`);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end(`Put operation not supported on /${req.params.noticeId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
        Notices.findByIdAndDelete(req.params.noticeId)
            .then((response) =>{
                res.statusCode=200;
                res.setHeader('Content-type','application/json');
                res.json(response);
            }, err => next(err))
                .catch(err => next(err))
    })

module.exports = noticeRouter;