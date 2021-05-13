var mongoose = require('mongoose');
var user = require('../model/users');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var usersSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        //required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String,
    role: String

});

usersSchema.methods.SetPasword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

usersSchema.methods.validPassword = function(password) {
    return this.hash === crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

var User = mongoose.model('users', usersSchema);


exports.user_registration_create = function(email, login, password, role) {
    var user_N = new User();
    user_N.email = email;
    user_N.name = login;
    user_N.role = role;
    user_N.SetPasword(password);
    return new Promise(function(resolve, reject) {
        user_N.save(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(user_N); //null
            }
        });
    });
};

//заглушка
exports.check_user = function(login, password) {
    return true;
};

exports.find_user = function() {
    return new Promise(function(resolve, reject) {
        user.find({}, function(err, user) {
            if (err) { reject(err); } else { resolve(user); }
        });
    });
};

//проверка пользователя
exports.find_user_f = function(login, password) {
    return new Promise(function(resolve, reject) {
        let params = {
            "name": login, //{$gte: params.startdate.toISOString(), $lt: params.finishdate.toISOString()}, //логин
            //{$in: [2]} //пароль
        };
        User.find(params, function(err, obj) {
            if (err) {
                reject(err);
            } else {
                resolve(obj);
            }
        })
    });
};

exports.find_user_password = function(password) { //поиск проверка пароля
    return new Promise(function(resolve, reject) {
        let params = {
            "password": validPassword(password)
        };
        user.find(params, function(err, pass) {
            if (err) {
                reject(err);
            } else {
                resolve(pass);
            }
        })
    });
};


/*
 exports.user_registration = function(email ,login,password){
    return new Promise(function (resolve, reject) {
        var user = new User();//
        user.email = "dima@gmail.com";
        user.name = "dima";
        user.password = "123";
        user.save(function(err){
            if (err) { 
                reject(err);
            }
            else { 
                resolve(null);
             }
        }
        );
    });
 };*/

//console.log(Users);

// var user = new User(); // 
// user.email = "dima@gmail.com";
// user.name = "dima";
// user.SetPasword("123");
// user.save(function(err){
//     if (err) { 
//           console.log('error by save user: ' + err.message); }
//     else { 
//         console.log('user ' + user.email + ' saved')
//      }
// }
// );