var express = require('express');
var router = express.Router();
var assert = require('assert');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.createConnection('localhost:27017/local');
var Schema = mongoose.Schema;

/* home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/list', function(req, res, next) {
  res.render('list');
});

router.get('/map', function(req, res, next) {
  res.render('map');
});

var userSchema = new Schema({
  UserName: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String}
}, {collection: 'user-data'});

var UserData = mongoose.model('user-data', userSchema);

/* Register Method */
router.post('/register', function(req,res,next) {

  var user = {
    UserName: req.body.userName,
    Password: req.body.password,
    Email: req.body.email,
  };

  currentUser = user.UserName;

  if(isPasswordValid(req.body.password,req.body.ConfirmPassword)) {
    if(req.body.email != null) {
      UserData.count({"UserName": currentUser})
          .then(function (count) {
            if (count == 0) {
              var data = new UserData(user);
              data.save();
              console.log("New user has been insert!");
              //res.render('list');
              res.redirect('/list');
            } else {
              console.log("User name already exist.");
            }
          });
    }else{
      console.log("Email is required");
      res.redirect('/');
    }
  }else{
    console.log("Password does not match");
    res.redirect('/');
  }
});

function isPasswordValid(first, second){
  return first === second;
}

/* Sign-In Method */
router.post('/signIn',function(req,res,next) {
  var success = false;
  var user = {
    UserName: req.body.userName,
    Password: req.body.password,
    Email: req.body.email
  };
  UserData.findOne({UserName:user.UserName, Password: user.Password}, function(err,obj){

    if(obj != null){
      console.log("User is in the DB!")
      currentUser = user.UserName;
      res.redirect('/list');
    }else{
      console.log("User Doesn't exist");
      res.redirect('/');
    }
  })

});

module.exports = router;
