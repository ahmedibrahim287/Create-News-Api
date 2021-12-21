const mongoose = require('mongoose');


const newsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true
    }

})

const News = mongoose.model('News', newsSchema)


module.exports = News