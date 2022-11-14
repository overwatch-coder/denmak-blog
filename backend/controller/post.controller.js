const Post = require("../model/post.model");

// Get All Posts Controller
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({createdAt: 'desc'});

        if(posts.length === 0){
            return res.status(200).json({message: 'No posts found'});
        }

        res.status(200).json(posts);

    } catch (error) {
        return res.status(500).json({message: "Error! Failure to fetch posts."});
    }
}

// Get Single Post Controller
const getPost = async (req, res) => {
    const { slug } = req.params;

    try {

        const post = await Post.findOne({slug});

        if(post === null) return res.status(404).json({message: 'Post not found. Link may be broken'});
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({message: "Sorry, could not fetch post"});
    }
}

module.exports = {
    getPosts,
    getPost,
}