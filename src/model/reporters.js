const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const reporterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 00,
        validate(value) {
            if (value < 0) {
                throw new Error('Age Must Be Positive Number')
            }
        }
    },
    tokens: [{
        type: String,
        required: true
    }],
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email Is Ivalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    phone: {
        type: String,
        required: true,
        maxlenght: 11,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value, 'ar-EG')) {
                throw new Error('Phone Number Is Invalid')
            }
        },
        unique: true

    },
    avatar: {
        type: Buffer
    }

})

reporterSchema.virtual('news', {
    ref: "News",
    localField: "_id",
    foreignField: "owner"
})


reporterSchema.statics.specificFind = async (email, password) => {
    const reporter = await Reporters.findOne({
        email
    })
    if (!reporter) {
        throw new Error("Unable to login ... plz check email or password")
    }
    const isMatch = await bcrypt.compare(password, reporter.password)
    if (!isMatch) {
        throw new Error("Unable to login ... plz check email or password")
    }
    return reporter
}



reporterSchema.pre('save', async function (next) {
    const reporter = this
    if (reporter.isModified('password'))
        reporter.password = await bcrypt.hash(reporter.password, 8)
    next();
});


reporterSchema.methods.generatToken = async function () {
    const reporters = this
    var token = jwt.sign({
        _id: reporters._id.toString()
    }, process.env.SECRET);
    reporters.tokens = reporters.tokens.concat(token)
    await reporters.save()
    return token
}



reporterSchema.methods.toJSON = function () {
    const reporters = this
    const reporterObject = reporters.toObject()
    delete reporterObject.password
    delete reporterObject.tokens
    return reporterObject
}



const Reporters = mongoose.model('Reporters', reporterSchema)


module.exports = Reporters