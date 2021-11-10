const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
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
    roomNo: {
        type: String,
        required: true
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    },
    cg: {
        type:String,
        
    },

    year: {
        type: String,
        required: true
    },


});

const Students = mongoose.model("Student",studentSchema);

module.exports = Students;