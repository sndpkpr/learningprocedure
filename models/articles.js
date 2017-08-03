var mongoose = require('mongoose');

//details scheema

var detailSchema = mongoose.Schema({
    username: {
        type: String,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    }
});


var Detail = module.exports = mongoose.model('details', detailSchema)         //variable to export