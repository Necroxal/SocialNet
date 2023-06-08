const User = require('./model');
const Follow = require('../follow/model');
const Publication = require('../publication/model');

const response = require('../../utils/response');
const jwt = require('../../utils/jwt');
const fs = require('fs');
const path = require('path');
const followService = require('../../utils/followService');
//bycript
const bcrypt = require('bcrypt');
const saltRounds = 10;


const testUser =  (req, res) => {
  return res.status(200).send({
    message: "The route test",
    user: req.user
  });
}
const createUser = async (req, res) => {
  //validation
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.nickname) {
    response.error(req, res, 'missing data', 440, 'fill remaining data');
    return;
  }

  const passEnc = req.body.password;
  const passCrypt = await bcrypt.hash(passEnc, saltRounds);

  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    bio: req.body.bio,
    nickname: req.body.nickname,
    password: passCrypt,
    email: req.body.email,
  });

  //others validations
  if (req.file) {
    const image = req.file.originalname;
    user.image = image;
  }
  if (req.body.role) {
    const role = req.file.role;
    user.role = role;
  }

  User.find({
    $or: [
      { email: user.email.toLocaleLowerCase() },
      { nickname: user.nickname.toLocaleLowerCase() }
    ]
  }).then((data) => {

    if (data && data.length >= 1) {
      response.succes(req, res, 'user exist', 201);
    }
    else {
      user.save(user)
        .then(data => {
          response.succes(req, res, data, 201);
        })
        .catch(err => {
          response.error(req, res, 'Internal error', 500, err)
        });
    }

  }).catch((error) => {

    if (error) {
      return response.error(req, res, 'Internal Error', 500, error);
    }
  })


}
const userLogin =  (req, res) => {
  //get params
  if (!req.body.email || !req.body.password) {
    response.error(req, res, '', 400, 'missing email or password');
    return
  }

  //search databse if exist}
  User.findOne({ email: req.body.email })
    .then(data => {
      const pwd = bcrypt.compareSync(req.body.password, data.password);
      if (!pwd) {
        return response.error(req, res, 'Password incorrect', 400, 'Password incorrect');
      }
      const token = jwt.createToken(data);

      return res.status(200).send({
        status: 'Success',
        message: 'login successful',
        user: {
          id: data._id,
          name: data.name,
          nickname: data.nickname,
        },
        token
      });

    }).catch(err => {
      if (err || !data) {
        return response.error(req, res, 'Wrong email', 400, err);
      }
    })

}
const profileUser =  (req, res) => {
  //Get the params of id user to url
  const id = req.params.id;
  //query for dates users
  User.findById(id)
    .select({ password: 0, role: 0 })
    .then(async data => {

      let followInfo = await followService.followThisUser(req.user.id, id);

      return res.status(200).send({
        status: 'success',
        user: data,
        following : followInfo.following,
        followers: followInfo.follower
      });

    }).catch(err => {
      if (err || !data) {
        return response.error(req, res, 'user not exist', 400, err);
      }
    });
}
const listUser =  (req, res) => {

  //check on the page we are on now
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  page = parseInt(page);
  const itemPerPage = 5; //limit elements
  //query with mongoose pagination

  const options = {
    limit: itemPerPage,
    page: page,
    sort: '_id',
    select: '-password -email -role -__v'
  }
  User.paginate({}, options).then(async data => {

    let  followUserIds =   await followService.followUserIds(req.user.id);
    return res.status(201).send({
      status: 'success',
      users: data.docs,
      page: data.page,
      limit: data.limit,
      total: data.totalDocs,
      pages: Math.ceil(data.totalDocs / data.limit),
      user_following: followUserIds.following,
      user_follow_me: followUserIds.followers
    });

  }).catch(err => {
    if (err || !data) {
      return response.error(req, res, 'Query error', 500, err);
    }
  });

}
const updateUser = async (req, res) => {

  let userIdentity = req.user;
  let userToUpdate = req.body;

  delete userIdentity.iat;
  delete userIdentity.exp;
  delete userIdentity.role;
  delete userIdentity.image;

  if (userToUpdate.password) {
    const passEnc = userToUpdate.password;
    const passCrypt = await bcrypt.hash(passEnc, saltRounds);
    userToUpdate.password = passCrypt;

  }else{
    delete userToUpdate.password;
  }

  //console.log(userToUpdate);

  //check user exist
  User.find({
    $or: [
      { email: userToUpdate.email.toLocaleLowerCase() },
      { nickname: userToUpdate.nickname.toLocaleLowerCase() }
    ]
  }).then((data) => {
    //console.log(data);
    let userIsset = false;
    data.forEach(user => {
      if (user && user._id != userIdentity.id) {
        userIsset = true;
      }
    })
    if (userIsset) {
      response.succes(req, res, 'user exist', 201);
    }
    User.findByIdAndUpdate({_id: userIdentity.id}, userToUpdate, { new: true }).then(data => {
      //Search and update
      return res.status(200).send({
        status: 'success',
        message: 'Update Method',
        data
      });
    }).catch(error => {
      if(error || !data){
        return response.error(req, res, 'Query error', 501, error);
      }

    })


  }).catch((error) => {

    if (error) {
      return response.error(req, res, 'Internal Error', 500, error);
    }
  })

}
const uploadImage = (req,res)=>{
  if(!req.file){
    response.error(req, res, 'Image empty', 440, 'uplaod image (jpg,png,jpge...)');
    return;
  }
  
  User.findByIdAndUpdate({_id: req.user.id},{image:req.file.filename},{new:true})
  .then(data=>{
    return res.status(200).send({
      status: 'success',
      user: data,
      file: req.file
    });
  }).catch(err=>{
    if(err || !data){
    response.error(req, res, 'upload image error', 500, err)
    }
  }); 
  //const filePath = req.file.path;
  //const dele = fs.unlinkSync(filePath);
 
}
const avatar = (req,res)=>{

  const file = req.params.file;

  const filePath = './public/avatars/'+file;
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
const counters = async(req,res)=>{
  let userId = req.user.id;
  if(req.params.id){
    userId = req.params.id;
  }
  try {
    const following = await Follow.count({'user': userId});
    const followed = await Follow.count({'followed': userId});
    const publications = await Publication.count({'user': userId});

    return res.status(200).send({
      userId,
      following,
      followed,
      publications
    });
    
  } catch (error) {
    response.error(req, res, 'Internal erro', 500, err)
  }
}


module.exports = {
  testUser,
  createUser,
  userLogin,
  profileUser,
  listUser,
  updateUser,
  uploadImage,
  avatar,
  counters
}