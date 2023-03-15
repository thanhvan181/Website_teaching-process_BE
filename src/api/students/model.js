const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        gender: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        country: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
        },
        languages: {
            type: String,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },

    },
    { collection: 'students', timestamps: true }
);

const _students = mongoose.model('students', StudentSchema);
module.exports = _students;