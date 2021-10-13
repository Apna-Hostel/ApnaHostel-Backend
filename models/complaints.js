const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    studentName: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    title: {
        type: String, 
        required: true 
    },
    complaint: {
        type: String, 
        required: true 
    },
    resolved: {
        type: Boolean,
        default: false
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    }
});

const Complaints = mongoose.model("Complaint", complaintSchema);

module.exports = Complaints