var express = require('express');
var router = express.Router();
var contr = require('../controllers/index.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//check.connect

exports.check_users = function(login, password) {
    return next();
    //if (req.session.userName === "undefined" || req.session.userName == null) { 
    //  res.redirect(303, '/registration'); }
    // else return next();   
};

//exports.

module.exports = router;