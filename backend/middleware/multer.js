const multer = require('multer'); //Module for upload files
//internal module of Nodejs for working with file and directory paths
const path = require('path'); 

//function that returns the specification of the file to upload
const uploadImage = () => {
    const storage = multer.diskStorage({
        //Save to a directory folder
        destination: './public/picsprofile',
        filename: (req, file, cb) => { //specs of dile
            const fileTypes = /jpeg|jpg|png|gif/; //Regular expression for extensions
            const mimetype = fileTypes.test(file.mimetype);
            const extname = fileTypes.test(path.extname(file.originalname)); //Check for regular expression extensions
            
            if (mimetype && extname) {
                return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`) //Format for the uploaded image
              }
            else{
                 cb("Error: invalid image format");
             
            }
        }
    });
    //load the configuration and assign a name to upload it
    const upload = multer({storage: storage}).single('image');
    return upload;
}


module.exports = {
    uploadImage
}