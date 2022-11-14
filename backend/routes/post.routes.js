const express = require('express');

const { 
    getPosts,
    getPost,
} = require('../controller/post.controller');

// initialise express router
const router = express.Router();

// get all posts route
router.get('/', getPosts);

// get single post route
router.get('/:slug', getPost);

module.exports = router;