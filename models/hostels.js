const mongoose = require('mongoose');

const hostelSchema = {
    name:{
        type:String,
        required:true
    }
};

const Hostel = mongoose.model("Hostels", hostelSchema);

module.exports = Hostel;