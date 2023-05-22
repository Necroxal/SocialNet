const User = require('./model');
const response = require('../../utils/response');
const jwt = require('../../utils/jwt');
//bycript
const bcrypt = require('bcrypt');
const saltRounds = 10;


const testUser = async (req, res) => {
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

const userLogin = async (req, res) => {
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

const profileUser = async (req, res) => {
  //Get the params of id user to url
  const id = req.params.id;
  //query for dates users
  User.findById(id)
    .select({ password: 0, role: 0 })
    .then(data => {
      return res.status(200).send({
        status: 'success',
        user: data
      });

    }).catch(err => {
      if (err || !data) {
        return response.error(req, res, 'user not exist', 400, err);
      }
    });
}

const listUser = async (req, res) => {

  //check on the page we are on now
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  page = parseInt(page);
  const itemPerPage = 5; //limit elements
  //query with mongoose pagination


  User.paginate({}, {
    limit: itemPerPage,
    page: page,
    sort: '_id'
  }).then((data) => {
    return res.status(201).send({
      status: 'success',
      users: data.docs,
      page: data.page,
      limit: data.limit,
      total: data.totalDocs,
      pages: Math.ceil(data.totalDocs / data.limit)
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
    User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true }).then(data => {
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
const uploadImage = async(req,res)=>{
  return res.status(200).send({
    status: 'success',
    message: 'Upload image'
  });
}

module.exports = {
  testUser,
  createUser,
  userLogin,
  profileUser,
  listUser,
  updateUser,
  uploadImage
}