const Publication = require('./model');
const response = require('../../utils/response');
const fs = require('fs');
const path = require('path');

const test = (req, res) => {
    return response.succes(req, res, 'success', 200);
}

const savePubli = (req, res) => {
    const params = req.body;

    if (!params.text) return res.status(401).send({ status: 'Errpr', message: 'text doesnt exist' });

    let newPublication = new Publication(params);
    newPublication.user = req.user.id;

    newPublication.save().then(data => {

        return res.status(200).send({
            status: 'success',
            message: 'Save Publication',
            data
        });

    }).catch(error => {
        return response.error(req, res, 'Internal error', 500, error);
    })

}
const onePubli = (req, res) => {
    const publicationId = req.params.id;

    Publication.findById(publicationId).then(data => {
        return res.status(200).send({
            status: 'success',
            message: 'Save Publication',
            publication: data
        });

    }).catch(error => {
        return response.error(req, res, 'There are no publications', 500, error);
    });
}

const deletePubli = (req, res) => {

    const publicationId = req.params.id;

    Publication.find({ 'user': req.user.id, '_id': publicationId }).findOneAndDelete().then(data => {

        return res.status(200).send({
            status: 'success',
            message: 'Delete Publication',
            publication: data
        });

    }).catch(error => {
        return response.error(req, res, 'COULD NOT DELETE', 500, error);
    });
}

const listPubliOneUser = (req, res) => {
    const userId = req.params.id;

    let page = 1;
    if (req.params.page) page = req.params.page;
    page = parseInt(page);

    const options = {
        page: page,
        limit: 5,
        sort: '-created_at',
        populate: ({ path: 'user', select: ' -role -__v -password'})
    }

    Publication.paginate({ user: userId }, options)
        .then(data => {

            return res.status(200).send({
                status: 'success',
                message: 'List Publications of one User',
                user: req.user,
                data: data.docs,
                total: data.totalDocs,
                pages: Math.ceil(data.totalDocs / data.limit),
                page: data.page
            });

        }).catch(err => {
            return response.error(req, res, ' There are no ads to display', 500, err);
        });
}

const uploadImagePubli = (req,res)=>{

    const publicationId = req.params.id;

    if(!req.file){
      response.error(req, res, 'Image empty', 440, 'uplaod image (jpg,png,jpge...)');
      return;
    }
    
    Publication.findByIdAndUpdate({user: req.user.id, '_id': publicationId},{image:req.file.filename},{new:true})
    .then(data=>{
      return res.status(200).send({
        status: 'success',
        publication: data,
        file: req.file
      });
    }).catch(err=>{
      if(err || !data){
      response.error(req, res, 'upload image error', 500, err)
      }
    }); 
   
  }

const publicationMedia = (req,res)=>{

    const file = req.params.file;
  
    const filePath = './public/publications/'+file;
    console.log(filePath);
    //validatiob
    fs.stat(filePath,(error,exists)=>{
      if(error || !exists){
        return res.status(404).send({
          status: 'Error',
          message: 'Does exist image'
        });
      }
      //Get file 
      return res.sendFile(path.resolve(filePath));
    })
  }
  
module.exports = {
    test,
    savePubli,
    onePubli,
    deletePubli,
    listPubliOneUser,
    uploadImagePubli,
    publicationMedia
}