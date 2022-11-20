const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(req.url === '/register'){
            cb(null, '../client/public/server-users-assets');
        }else{
            cb(null, '../client/public/server-blogs-assets');
        }
    },
    filename: (req, file, cb) => {
        let filename;
        if(req.url !== '/register'){
            filename = `blog_image-${file.fieldname}-${uuid()}${path.extname(file.originalname)}`;
        }else {
            filename = `user_photo-${file.fieldname}-${uuid()}${path.extname(file.originalname)}`;
        }
        
        cb(null, filename);
    }
});

const upload = multer({storage: storage});

module.exports = upload;