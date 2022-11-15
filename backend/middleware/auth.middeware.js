const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
     const token = req.cookies.access_token;

     if(!token) return res.status(403).json({message: 'No token found, not authenticated'});

     try {
          const uid = jwt.verify(token, process.env.JWT_SECRET);
          req.user = uid;
     } catch (error) {
          res.status(401).json({message: 'Token is not verified. Not authorized'});
     }

     next();
}

module.exports = authUser;