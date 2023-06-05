const Publication = require('./model');
const response = require('../../utils/response');
const test = (req, res) => {
    return response.succes(req, res, 'success', 200);
}


module.exports = {
    test
}