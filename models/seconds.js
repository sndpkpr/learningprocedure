var mongoose = require('mongoose');

//seconds scheema

mongoose.model('seconds',{
    commonkey:{
        type: String
    },
    address: {
        type: String,
    },
    comment: {
        type: String,
    }
});


//var Second = module.exports = mongoose.model('seconds', secondsSchema)         //variable to export