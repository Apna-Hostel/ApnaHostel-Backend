const express = require('express');
const bodyParser = require('body-parser');
const roomRouter = express.Router();
roomRouter.use(bodyParser.json());
const Rooms = require('../models/rooms');
const User = require('../models/users');
var authenticate = require('../authenticate');
const cors = require('./cors');

roomRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        console.log(req.user.hostel);
        Rooms.find({ hostel: req.user.hostel })
            .populate('hostel')
            .then((rooms) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(rooms);
            }, err => next(err))
            .catch(err => next(err))
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.end('put request not valid on the /rooms end point')
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        req.body.hostel = req.user.hostel;
        Rooms.create(req.body)
            .then((room) => {
                Rooms.findById(room._id)
                    .populate('hostel')
                    .then((room) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(room)
                    }, (err) => next(err))


            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Rooms.deleteMany({ hostel: req.user.hostel })
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err))
    })

roomRouter.route('/:roomId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Rooms.findById(req.params.roomId)
            .then((room) => {
                if (room != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(room);
                } else {
                    const err = new Error("student not found");
                    err.status = 403;
                    return (next(err));
                }
            }, (err) => next(err))
            .catch(err => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Rooms.findById(req.params.roomId)
            .then((room) => {
                if (room != null) {
                    console.log(room);
                    Rooms.findByIdAndUpdate(req.params.roomId, {
                        $set: req.body
                    }, { new: true })
                        .then((newRoom) => {
                            Rooms.findById(newRoom._id)
                                .then((room) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    res.json(room);
                                }, err => next(err))
                        }, err => next(err))
                }
            }, err => next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.end('post operations not available')
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Rooms.findByIdAndDelete(req.params.roomId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(response);
            }, err => next(err))
    })

module.exports = roomRouter;