const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const Post = require('../model/post.model');

// user sign up controller
const registerUser = async (req, res) => {
    const { email, password, username, fullname, phone, photo } = req.body;

    if(!email || !password || !username || !fullname) return res.status(401).json({message: 'Fields marked with * are all required!'})

    try {
        const foundUserByEmail = await User.findOne({ email });
        const findByUsername = await User.findOne({username});

        if(foundUserByEmail) return res.status(401).json({message: 'User already exists!'});

        if(findByUsername) return res.status(401).json({message: 'username already taken!'});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            email,
            password: hashedPassword,
            username, 
            fullname,  
            phone,
            photo,
            uid: uuid()
        }

        const newUser = new User(userData);
        const savedUser = await newUser.save();

        if(savedUser){
            const { email, username, fullname, photo, phone, uid } = savedUser;
            const user = {
                email, 
                fullname,
                photo,
                phone,
                username
            }
            const token = jwt.sign(uid, process.env.JWT_SECRET);
          return res.status(200).json({user, token, message: 'User registration successful'});
        }

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}


// user login controller
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) return res.status(401).json({message: 'All fields are required'});
    try {

        const findUserByEmail = await User.findOne({email});
        
        if(!findUserByEmail) return res.status(401).json({message: 'Email does not exist!'});

        const isValidPassword = await bcrypt.compare(password, findUserByEmail.password);

        if(!isValidPassword) return res.status(403).json({message: 'Password is incorrect'});

            const user = {
                email: findUserByEmail.email, 
                fullname: findUserByEmail.fullname,
                photo: findUserByEmail.photo,
                phone: findUserByEmail.phone,
                username: findUserByEmail.username
            }

        const token = jwt.sign(findUserByEmail.uid, process.env.JWT_SECRET);

        return res.status(200).json({message: 'User successfully logged in', token, user});

    } catch (error) {
       return res.status(400).json({message: error.message});
    }
}



// Update User Controller
const updateUser = async (req, res) => {
    const userData = req.body;
    const user = req?.user;
    if(!user) return res.status(500).json({messahe: 'Not authorized to access this route'});

    try {

        const findByUid = await User.findOneAndUpdate({uid: user}, userData, { new: true});

        if(findByUid){

            const { email, username, fullname, photo, phone } = findByUid;

            const userData = {
                email, 
                fullname,
                photo,
                phone,
                username
            }
            return res.status(200).json(
                {
                    message: 'Updated user details successfully', 
                    user: userData 
                });
        }

    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// Delete User Controller
const deleteUser = async (req, res) => {
    const user = req?.user;
    if(!user) return res.status(500).json({messahe: 'Not authorized to access this route'});

    try {

        const deletedByUid = await User.findOneAndDelete({uid: user});

        if(deletedByUid){
            const userPosts = await Post.deleteMany({uid: deletedByUid.uid});
            return res.status(200).json(
                {
                    message: 'User details and related posts deleted successfully', 
                    userId: deletedByUid.uid,
                    postsDeleted: userPosts?.deletedCount
                });
        }

    } catch (error) {
        res.status(400).json({message: error.message});
    }
}




module.exports = {
    loginUser,
    registerUser,
    updateUser,
    deleteUser
}