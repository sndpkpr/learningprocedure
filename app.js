var express = require('express')
var bodyParser = require('body-parser')
var favicon = require('serve-favicon')
var path = require('path')
var expressValidator = require('express-validator')
var fs = require('fs')
var _ = require('lodash')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient

mongoose.connect('mongodb://localhost/datbaseuserdetail', { useMongoClient: true });    //connect to our database  -> nodesan is the name of our database
var db = mongoose.connection;     //create variable called bd and set that equal to mongooseconnection
mongoose.set('debug', true);

////////////////////////////////////////////////
MongoClient.connect('mongodb://localhost/datbaseuserdetail')

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Something.findById(id, function (err, user) {
    done(err, user);
  });
});

////////////////////////////////////////////////


//check connection
db.once('open', function () {
    console.log('Connected to mongoDB')
})

//check for db error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



var app = express();
// var logger = function(req,res,next){
//     console.log('LOGGING..........')
//     next()
// }


var Something = require('./models/articles')

//view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/content/views'))

// app.use(logger)
app.use(favicon(path.join(__dirname, 'content', 'images', 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize());
app.use(passport.session());
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


app.use(express.static(path.join(__dirname, 'content')))

passport.use(new LocalStrategy(
    function (username, password, done) {
        //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Inside LOCAL")
        Something.findOne({ username: username,password:password }, function (err, user) { 
            //console.log("******************************************************",user)   
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            //if (!user.verifyPassword(password)) { return done(null, false); }
            else
            return done(null, user);
        });
    }
));


app.get('/', function (req, res) {
    Something.find().exec(function (err, details) {
        if (err) {
            console.log('error in finding details in database')
        }
        else {
            //console.log(details)
            res.render('index', {
                detai: details
            })
        }
    })
})


app.post('/add', function (req, res) {
    var username = req.body.username;
    var userphone = req.body.userphone;
    var usermail = req.body.email;
    var userpass = req.body.password;
    console.log(userpass)
    var newentry = {
        username: username,
        name: username,
        phone: userphone,
        email: usermail,
        password: userpass
    }
    MongoClient.connect('mongodb://localhost/datbaseuserdetail', function (err, db) {
        db.collection("details").insertOne(newentry, function (err, res) {
            if (err) throw err;
            db.close();
        })
    })
    res.redirect('/')
})

app.get('/fail', function (req, res) {
    res.render('fail')
})




app.get('/delete', function (req, res) {

    var performOperation = (_.invert(req.query));
    if (performOperation.delete) {
        Something.findByIdAndRemove(performOperation.delete, function (err, todo) {
            res.redirect('/')
        });
    }

    if (performOperation.update) {
        console.log(performOperation.update)
        Something.findOne({ _id: performOperation.update }).exec(function (err, details) {

            res.render('temp', {
                detai: details,
                identiy: performOperation.update
            })
        })
    }

})


app.post('/update', function (req, res) {
    var userid = req.body.mongoid
    var newusername = req.body.username
    var newuserphone = req.body.userphone
    var newuseremail = req.body.email

    Something.update(
        { _id: userid },
        {
            name: newusername,
            phone: newuserphone,
            email: newuseremail
        },
        { multi: true },
        function (err, detail) {
            if (err) {

            }
            else {

            }

        })
    res.redirect('/')
})

app.post('/checkAuth', passport.authenticate('local', { failureRedirect: '/fail' }), function (req, res) {
    console.log("INSIDE AFTER SUCCESS")
    res.redirect('/')
})

app.get('/login', function (req, res) {
    res.render('login')
})


app.listen(3000, function () {
    console.log('Server started at port 3000...')
})