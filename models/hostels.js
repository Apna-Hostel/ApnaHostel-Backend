const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hostelSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
});

const Hostels = mongoose.model("Hostel", hostelSchema);

module.exports = Hostels;