const express = require('express');
const bodyParser = require('body-parser');
const studentRouter = express.Router();
studentRouter.use(bodyParser.json());
const Students = require('../models/students');
const User = require('../models/users');
var authenticate = require('../authenticate');
const cors = require('./cors');

studentRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        console.log(req.user.hostel);
        Students.find({ hostel: req.user.hostel })
            .populate('hostel')
            .then((Students) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(students);
            }, err => next(err))
            .catch(err => next(err))
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.end('put request not valid on the /students end point')
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        req.body.hostel = req.user.hostel;
        Students.create(req.body)
            .then((student) => {
                Students.findById(student._id)
                    .populate('hostel')
                    .then((student) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(student)
                    }, (err) => next(err))


            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Students.deleteMany({ hostel: req.user.hostel })
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err))
    })

