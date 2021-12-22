const jwt = require('jsonwebtoken');
const Reporters = require('../model/reporters');

const auth = async (req, res, next) => {
    try {

        const token = req.header("Authorization").replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.SECRET)
        const reporter = await Reporters.findOne({
            _id: decode._id,
            tokens: token
        })
        if (!reporter) {
            throw new Error()
        }
        req.reporter = reporter
        req.token = token
        next()


    } catch (e) {
        res.status(400).send({
            error: "please auth"
        })
    }

}

module.exports = auth