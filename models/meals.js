const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    day:{
        type:String,
        required:true
    },
    breakfast:{
        type:Array,
        required:true
    },
    lunch:{
        type:Array,
        required:true
    },
    snacks:{
        type:Array,
        required:true
    },
    dinner:{
        type:Array,
        required:true
    },
    hostel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hostel'
    }
});

const Meals = mongoose.model("Meal", mealSchema);

module.exports = Meals;