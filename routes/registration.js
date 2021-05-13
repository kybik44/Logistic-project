/*var user = require('../model/users');
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');*/


exports.registration_post_r = function(req, res) {
    var email = req.body.email;
    var login = req.body.login;
    var password = req.body.password;
    var role = req.body.role
}

// mongoose.model('User', usersSchema);