const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema ({

    roomId:{
        type:String,
        required:true
    },

    capacity:{
        type:String,
        required:true,
        
    },

    alloted:{
        type:String,
        required:true
    }
});

