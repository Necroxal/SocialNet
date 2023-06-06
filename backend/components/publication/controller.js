const Publication = require('./model');
const response = require('../../utils/response');
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
module.exports = {
    test,
    savePubli,
    onePubli
}