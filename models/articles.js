var mongoose = require('mongoose');

//details scheema

mongoose.model('details',{
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
        index: { unique: true }
    },
    email: {
        type: String,
        index: { unique: true }
    }
});


//var Detail = module.exports = mongoose.model('details', detailSchema)         //variable to export
