const express = require('express');

const { 
    getPosts,
    getPost,
    addPost,
    updatePost,
    deletePost 
} = require('../controller/auth-post.controller');
const authUser = require('../middleware/auth.middeware');
const upload = require('../middleware/uploadFile');

// initialise express router
const router = express.Router();

router.use(authUser);

// get all Posts of User route
router.get('/', getPosts);

// get single Post of User route
router.get('/:slug', getPost);

// add Post route
router.post('/', upload.single('image'), addPost);

// update Post
router.put('/:id', updatePost);

// delete Post
router.delete('/:id', deletePost);

module.exports = router;