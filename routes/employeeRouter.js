const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const employeeRouter = express.Router();
employeeRouter.use(bodyParser.json());
const cors = require('./cors');

const Employees = require('../models/employees');
const User = require('../models/users');

employeeRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        console.log(req.body);
        Employees.find({ hostel: req.user.hostel })
            .populate('hostel')
            .then((Employees) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(employees);
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        req.body.hostel = req.user.hostel;
        Employees.create(req.body)
            .then((employee) => {
                Employees.findById(employee._id)
                    .populate('hostel')
                    .then((employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee)
                    }, err => next(err))
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /employees');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Employees.deleteMany({ hostel: req.user.hostel })
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(response);
            }, (err) => next(err))
    })