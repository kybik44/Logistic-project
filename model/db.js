var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/Logistic';

var mongoShutDown = function (msg, callback) {
    mongoose.connection.close(function(){
        console.log('mongoose disconnected through ' + msg);
        callback();
    });
};

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose error: ' + err);
});

process.on('SIGINT', function() {
    mongoShutDown('app terminated', function() {
        process.exit(0);
    });   
});

require('./users');