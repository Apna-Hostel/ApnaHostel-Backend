const express = require('express');
const bodyParser = require('body-parser');

const roomRouter = express.Router();
roomRouter.use(bodyParser.json());

var authenticate = require('../authenticate');
const cors = require('./cors');
const Rooms = require('../models/rooms')

roomRouter.route('/')
    .options(cors.corsWithOptions, (req,res) => {res.sendStatus(200)})
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) =>{
        Rooms.find
    })

