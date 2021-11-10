const mongoose = require('mongoose');

const mealBillsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    sid:{
        type:String,
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
    paymentDate: {
        type: Date, 
        required: true 
    },
    hostel:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Hostel'
    }
});

const MealBills = mongoose.model("MealBill",mealBillsSchema);

module.exports = MealBills;