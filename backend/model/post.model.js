const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title is required!'],
        minLength: [6, 'Title must be between 6 & 60 words'],
        maxLength: [60, 'Title must be between 6 & 60 words']
    },

    content: {
        type: String,
        required: [true, 'content is required!'],
        minLength: [20, 'Content must be more than 19 words']
    },

    slug: {
        type: String,
        lowercase: true
    },

    author: String,

    image: String,

    uid: String,

    comments: [{
        displayName: String,
        body: String
    }],

    category: String

}, {
    timestamps: true
})

const Post = mongoose.model('post', postSchema);

module.exports = Post