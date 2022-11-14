const User = require("../model/user.model");
const Post = require('../model/post.model');
const { default: mongoose } = require("mongoose");

// All Functions that can be performed by an authenticated user

// Get All Posts Controller
const getPosts = async (req, res) => {
    const user = req.user;
    if(!user) return res.status(500).json({message: "No token found, not authenticated"});

    try {
        const posts = await Post.find({uid: user}).sort({createdAt: 'desc'});

        if(posts.length === 0){
            return res.status(200).json({message: 'No posts found!'});
        }

        res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({message: "Error! Failure to fetch posts."});
    }
}

// Get Single Post Controller
const getPost = async (req, res) => {
    const { slug } = req.params;
    const user = req.user;
    if(!user) return res.status(500).json({message: "No token found, not authenticated"});

    try {
        const post = await Post.findOne({$and: [{uid: user}, {slug: slug}]});
        if(post === null) return res.status(501).json({message: 'Not authorized'});

        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({message: "Sorry, could not fetch post"});
    }
}

// Add Post Controller
const addPost = async (req, res) => {
    const user = req.user;
    if(!user) return res.status(500).json({message: "No token found, not authenticated"});

    const { title, content, image, comments, category } = req.body;
    if(!title || !content ) return res.status(400).json({message: 'Title & Content fields are required'});

    try {

        const username = await User.findOne({uid: user}).select('username');

        const postData = {
            title,
            author: username.username,
            content,
            image, 
            comments,
            category,
            uid: user,
            slug: title.replace(/\s+/g, '-').toLowerCase().replace(/\?/g, '')
        }

        const postToSave = new Post(postData);
        const post = await postToSave.save();

        if(post){
            res.status(200).json({message: 'Post added successfully', data: post});
        }

    } catch (error) {
        res.status(500).json({message: "Error! Failure to create post! Try again later"});
    }

}

// Update Post Controller
const updatePost = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.isValidObjectId(id)) return res.status(400).json({message: 'id is not a valid object id'});

    const user = req.user;
    if(!user) return res.status(500).json({message: "No token found, not authenticated"});

    const slug = req?.body?.title?.replace(/\s+/g, '-').toLowerCase().replace(/\?/g, '');

    try {
        const post = await Post.findOneAndUpdate({$and: [{uid: user}, {_id: id}]}, {...req.body, slug: slug}, {new: true});
        res.status(200).json({message: 'Post updated successfully', data: post});
    } catch (error) {
        res.status(500).json({message: "Error! Failure to update post! Try again later"});
    }

}

// Delete Post Controller
const deletePost = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.isValidObjectId(id)) return res.status(400).json({message: 'id is not a valid object id'});

    const user = req.user;
    if(!user) return res.status(500).json({message: "No token found, not authenticated"});

    try {
        await Post.findOneAndDelete({$and: [{uid: user}, {_id: id}]});
        res.status(200).json({message: 'Post deleted successfully'});
    } catch (error) {
        res.status(500).json({message: "Error! Failure to delete post! Try again later"});
    }
}

module.exports = {
    getPosts,
    getPost,
    addPost,
    updatePost,
    deletePost
}