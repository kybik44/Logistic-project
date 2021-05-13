var mongoose = require('mongoose');
var Services = require('../model/services');

var servicesSchema = new mongoose.Schema({
    Name: {
        type: String,
        minlength: 1,
        maxlength: 300
    },

    Code: {
        type: String,
        required: true
    },

    Unit: { //единица измерения
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },

    VendorCode: { //artikul
        type: String,
        required: true,
        min: 500
    },

    Country_of_origin: {
        type: String
    },

    Weight: {
        type: Number
    },
    Service: { //услуга
        type: Boolean
    }
});

var Services = mongoose.model('services', servicesSchema); //var
exports.services = Services;
exports.find_services = function() {
    return new Promise(function(resolve, reject) { //
        Services.find({}, function(err, services) {
            if (err) { reject(err); } else {
                resolve(services);
            }
        });
    });
};

exports.find_services_id = function(_id) {
    return new Promise(function(resolve, reject) { //
        Services.find({ "_id": _id }, function(err, services) {
            if (err) { reject(err); } else {
                resolve(services);
            }
        });
    });
};

exports.create_services = function(Name, Code, Unit, VendorCode, Country_of_origin, Weight, Service) {

    var services_N = new Services();
    services_N.Name = Name;
    services_N.Code = Code;
    services_N.Unit = Unit;
    services_N.VendorCode = VendorCode;
    services_N.Country_of_origin = Country_of_origin;
    services_N.Weight = Weight;
    services_N.Service = Service;

    return new Promise(function(resolve, reject) {
        services_N.save(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(services_N); //null
            }
        });
    });
};

exports.delete_services = function(id) {
    return new Promise(function(resolve, reject) {

        Services.findOneAndRemove({ "_id": id }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    })
};

exports.update_services = function(Name, Code, Unit, VendorCode, Country_of_origin, Weight, Service, _id) {
    return new Promise(function(resolve, reject) {
        var services_info = {
            Name: Name,
            Code: Code,
            Unit: Unit,
            VendorCode: VendorCode,
            Country_of_origin: Country_of_origin,
            Weight: Weight,
            Service: Service
        };

        Services.findOneAndUpdate({ "_id": _id }, services_info, { upsert: true, new: true, runValidators: true }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    })
};