var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');
const {TokenExpiredError} = require('jsonwebtoken');

router.use(bodyParser.json());  // we can use express.json instead of bodyParser.json

router.options('*',(req,res) =>{
  res.sendStatus(200);
});

/* GET users listing. */
router.get('/',authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({},(err,users) =>{
    if(err)
    return next(err);

    else {
      res.statusCode=200;
      res.setHeader('Content-type','application/json');
      res.json(users);
    }
  })
});

router.post('/signup',(req,res,next) => {
  User.register(new User({username:req.body.username}),
  req.body.password, (err,user) => {
    if(err){
      res.statusCode=500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      if(req.body.admin){
        user.admin= req.body.admin;
      }
      if(req.body.hostel){
        user.hostel=req.body.hostel;
      }
      user.save((err,user) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-type','application/json');
          res.json({err:err});
          return;
        }
        passport.authenticate('local')(req,res, () =>{
          res.statusCode=200;
          res.setHeader('Content-type','application/json');
          res.json({success:true,status:'Registration Successful!!'});
        });
      })
    }
  });
});

router.post('/login',(req,res,next) => {
  passport.authenticate('local', (err,user,info) => {
    if(err)
    return next(err);

    if(!user){
      res.statusCode=401;
      res.setHeader(('Content-type','application/json'));
      res.json({success:false,status:'Login Unsuccessful', err:info});
    }

    req.logIn(user,(err) =>{
      if(err)
      {
        res.statusCode=401;
        res.setHeader('Content-type','application/json');
        res.json({success:false,status:'Login Unsuccessful!!', err:'Could not login in user!' });
      }

    var token = authenticate.getToken({_id:req.user._id});
    var admin = req.user.admin;
    res.statusCode = 200;
    res.setHeader('Content-type','application/json');
    res.json({success:true,status:'Login Successful!', token:token, admin:admin});
  });
})(req,res,next);
});

router.get('/logout', (req,res) =>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error ('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/checkJWTtoken',(req,res) =>{
  passport.authenticate('jwt',{session:false},(err,user,info) =>{
    if(err)
    return next(err);

    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-type','application/json');
      return res.json({status:'JWT invalid!', success:false, err:info});
    }
    else{
      res.statusCode=200;
      res.setHeader('Content-type','application/json');
      return res.json({status:'JWT valid!',success:true,user:user});
    }
  })(req,res);
});


module.exports = router;
