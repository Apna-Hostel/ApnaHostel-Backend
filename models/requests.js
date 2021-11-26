const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    studentName: {
        type : String,
        required:true
    },
    sid:{
        type : String,
        unique:true,
        required:true
    },
    mobileNo: {
        type: String,
        unique:true,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true 
    },
    branch: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    fatherName: {
        type: String, 
        required: true 
    },
    motherName: {
        type: String, 
        required: true 
    },
    fatherMobile: {
        type: String,  
        required: true 
    },
    hostelName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    },
    cg: {
        type:String,
        required: true,
        default: "0"
    },

    year: {
        type: String,
        required: true
    },


});

const Requests = mongoose.model("Request", requestSchema);

module.exports = Requests;