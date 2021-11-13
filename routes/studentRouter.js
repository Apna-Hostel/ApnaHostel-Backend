const express = require('express');
const bodyParser = require('body-parser');
const studentRouter = express.Router();
studentRouter.use(bodyParser.json());
const Students = require('../models/students');
const User = require('../models/users');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Rooms = require('../models/rooms');

studentRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        console.log(req.user.hostel);
        Students.find({ hostel: req.user.hostel })
            .populate('hostel')
            .then((students) => {
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
        const roomNo = req.body.roomNo;
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

studentRouter.route('/:studentId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Students.findById(req.params.studentId)
            .then((student) => {
                if (student != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(student);
                } else {
                    const err = new Error("student not found");
                    err.status = 403;
                    return (next(err));
                }
            }, (err) => next(err))
            .catch(err => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Students.findById(req.params.studentId)
            .then((student) => {
                if (student != null) {
                    console.log('hello');
                    Students.findByIdAndUpdate(req.params.studentId, {
                        $set: req.body
                    }, { new: true })
                        .then((newStudent) => {
                            Students.findById(newStudent._id)
                                .then((stu) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    res.json(stu);
                                }, err => next(err))
                        }, err => next(err))
                }
            }, err => next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.end('post operations not available')
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Students.findByIdAndDelete(req.params.studentId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(response);
            }, err => next(err))
    })

module.exports = studentRouter;