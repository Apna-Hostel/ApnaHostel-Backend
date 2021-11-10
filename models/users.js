const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
   /* username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },*/
    admin: {
        type: Boolean,
        default: false
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    },
});
User.plugin(passportLocalMongoose);
const Users = mongoose.model('User', User); 
module.exports = Users