const express = require("express");
const bodyParser = require("body-parser");
const complaintRouter = express.Router();
complaintRouter.use(bodyParser.json());

const Complaints = require("../models/complaints");
var authenticate = require("../authenticate");
const cors = require("./cors");

complaintRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Complaints.find({ hostel: req.user.hostel })
      .populate("studentName")
      .populate("hostel")
      .then(
        (complaints) => {
          res.statusCode = 200;
          res.setHeader("Content-type", "aplication/json");
          res.json(complaints);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
      res.end('Put request is not valid on the hostel\'s end point ')
   })

   .post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) =>{
       req.body.studentName = req.user._id;
       req.body.hostel = req.user.hostel;
       Complaints.create(req.body)
        .then((complaint) =>{
           Complaints.findById(complaint._id)
            .populate('studentName')
            .populate('hostel')
            .then((complaint) =>{
                res.status=200;
                res.setHeader('Content-type','application/json')
                res.json(complaint);
            }, err => next(err))
           .catch( err => next(err))
       })

    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,admin) =>{
        Complaints.deleteMany({hostel:req.user.hostel})
            .then((response) =>{
                res.statusCode = 200;
                res.setHeader('Content-type','application/json');
                res.json(response)
            }, err => next(err))
    })


complaintRouter.route('/:complaintId')
    .options(cors.corsWithOptions, (req,res) =>{ res.sendStatus(200)})
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
      Complaints.findById(req.params.complaintId)
      .then((complaint =>{
        if(complaint!=null){
          Complaints.findByIdAndUpdate(req.params.complaintId, {$set: req,body}, {new:true})
            .then((complaint) =>{
              Complaints.findById(complaint._id)
                .then((complaint) =>{
                  res.sendStatus(200);
                  res.setHeader('Content-type', 'application/json');
                  res.json(complaint);
                }, err => next(err))
            }, err =>next(err))
        }
      }, err => next(err)))
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
        Complaints.findByIdAndDelete(req.params.complaintId)
        .then((response) => {
          res.statusCode=200;
          res.setHeader('Content-type', 'application/json');
          res.json(response);
        }, err => next(err))
          .catch(err => next(err))
    })

    module.exports = complaintRouter; 
