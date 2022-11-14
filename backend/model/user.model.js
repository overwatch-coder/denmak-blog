const mongoose = require('mongoose');
const { isEmail, isStrongPassword } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required!'],
        validate: [isEmail, 'email is invalid!']
    },
    password: {
        type: String,
        required: [true, 'password is required!'],
        validate: [isStrongPassword, 'password is not striong enough!']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'username is required!']
    },
    fullname: {
        type: String,
        required: [true, 'full name is required!']
    },
    phone: {
        type: String
    },
    photo: {
        type: String
    },
    uid: {
        type: String
    }
}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema);

module.exports = User;