const testUser = async(req,res)=>{
    return res.status(200).send({
      message: "The route test",
      user: req.user
    });
  }

module.exports = {
    testUser
}