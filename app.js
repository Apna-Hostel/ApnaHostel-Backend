//in-built APIS
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); // parses the cookie header and populate req.cookies with kye-values pair of cookie names.
var logger = require('morgan');
const mongoose = require('mongoose');       // helps in connecting the mongoose database
const session = require('express-session'); // sesssion id is stored (on the server side) 
var passport = require('passport');   // authenticates requests, and provides hooks 

//intitalizing custom routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studentRouter = require('./routes/studentRouter');
var employeeRouter = require('./routes/employeeRouter');
var noticeRouter = require('./routes/noticeRouter');
var complaintRouter = require('./routes/complaintRouter');
var hostelRouter = require('./routes/hostelRouter');
var mealBillsRouter = require('./routes/mealBillsRouter');

// connnecting to the database
require('dotenv').config();
const DB_url = process.env.MONGO_URL; 
const connect = mongoose.connect(DB_url,{useNewUrlParser:true ,useUnifiedTopology:true});
connect.then((db) => {
    console.log('successfully connected to the server');
}, (err) => {console.log(err)});


const app = express();

// setting up view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine','jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(passport.initialize());

app.use(express.static(path.join(__dirname,'public'))); // our stylesheets

//setting up custom routes
app.use('/',indexRouter);
app.use('/users',usersRouter);

// app.use('/students',studentRouter);
// app.use('/employees',employeeRouter);
// app.use('/hostels',hostelRouter);
// app.use('/complaints',complaintRouter);
// app.use('/mealBills', mealBillsRouter);
// app.use('/notices',noticeRouter);



// forwarding error to the error handler
app.use(function(req,res,next){
    next.createError(404);
});

app.use(function(err,req,res,next){
    res.locals.message = err.message;
    //res.locals.error = req.app.get('env') === 'development' ? err: {};

    // rendering the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;






