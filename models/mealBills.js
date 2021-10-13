const mongoose = require('mongoose');

const mealBillsSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    sid:{
        type:string,
        required:true
    },
    branch: {
        type:String,
        required:true
    },
    payment:{
        type:String,
        required:true
    },
    hostel:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Hostel'
    }
});

const MealBills = mongoose.model("MealBill",mealBillsSchema);

module.exports = MealBills;