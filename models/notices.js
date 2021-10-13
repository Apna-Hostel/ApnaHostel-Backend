const mongoose = required('mongoose');

const noticeSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    hostel:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Hostel'
    }

});

const Notices = mongoose.Schema("Notice",noticeSchema);

module.exports = Notices;