const express = require('express');
const { loginUser, registerUser, updateUser, deleteUser, logout } = require('../controller/auth.controller');
const authUser = require('../middleware/auth.middeware');

// initialise express router
const router = express.Router();

// login user
router.post('/login', loginUser);

// register user
router.post('/register', registerUser);

// apply middleware in authenticate user
router.use(authUser);

// update user
router.put('/update', updateUser);

// delete user
router.delete('/delete', deleteUser);

// logout user
router.post('/logout', logout);


module.exports = router;