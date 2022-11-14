const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
     const bearer = req.headers?.authorization;
     const token = bearer?.split(' ')[1];

     if(!token) return res.status(500).json({message: 'No token found, not authenticated'});

     try {
          const uid = jwt.verify(token, process.env.JWT_SECRET);
          req.user = uid;
     } catch (error) {
          res.status(500).json({message: 'Token is not verified. Not authorized'});
     }

     next();
}

module.exports = authUser;