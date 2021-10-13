const mongoose = require('mongoose');

const hostelSchema = new Schema({
    name:{
        type:String,
        required:true
    }
});

const Hostel = mongoose.model("Hostels", hostelSchema);

module.exports = Hostel;