var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var resultArray = [];
var url = 'mongodb://localhost:27017/local';

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('map');
});

router.get('/list', function(req, res, next) {

  res.render('list');
  res.redirect('/');
});
router.get('/index', function(req, res, next) {

  res.redirect('/index');
});

router.get('/get-data', function(req,res,next){

  mongo.connect(url,function(err,db){
    assert.equal(null,err);
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc,err){
      assert.equal(null,err);
      resultArray.push(doc);
    },function(){
      db.close();
      res.render('index',{siteList:resultArray});
      console.log("show the list!!");
    })
  })

});

router.post('/insert', function(req,res,next){
  var item = {
    name: req.body.name,
    address: req.body.address,
    cost: req.body.cost
  };

  resultArray.push(item);
  mongo.connect(url, function(err, db){
    assert.equal(null,err);
    db.collection('user-data').insertOne(item,function(err,result){
      assert.equal(null,err);
      console.log("Item has been insert! You are the best!!");
      onAddItem(item);
      db.close();
    })
  })

  res.redirect('/');
})

function onAddItem(newItem){
  var a=9;

};


module.exports = router;
