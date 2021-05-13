var mongoose = require('mongoose');
//var Country = require('../model/country_list');

var countrySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 5,
            maxlength: 300
        }     
    })

var Country = mongoose.model('country', countrySchema, 'countries'); //var

exports.find_country = function () {
    return new Promise(function (resolve, reject) {  //
        Country.find({}, function (err, country) {
            if (err) { reject(err); }
            else {
                resolve(country);
            }
        });
    });
};  