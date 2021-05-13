var mongoose = require('mongoose');
var Providers = require('../model/providers');

var providersSchema = new mongoose.Schema({
    Name: {
        type: String,
        minlength: 10,
        maxlength: 300
    },

    Type: {
        type: String,
        required: true
    },

    UNP: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 20
    },

    Legal_address: {
        type: String,
        required: true,
        min: 500
    },

    Actual_address: {
        type: String
    },

    Tel: {
        type: Number
    },
    Person: {
        type: String
    },
    Payment: {
        type: String
    },
    Rating: {
        type: Number
    }
});

var Providers = mongoose.model('providers', providersSchema); //var
exports.providers = Providers
exports.find_providers = function() {
    return new Promise(function(resolve, reject) { //
        Providers.find({}, function(err, providers) {
            if (err) { reject(err); } else {
                resolve(providers);
            }
        });
    });
};

exports.find_provider_id = function(_id) {
    return new Promise(function(resolve, reject) { //
        Providers.find({ "_id": _id }, { _id: 0, __v: 0 }, function(err, providers) {
            if (err) {
                reject(err);
            } else {
                resolve(providers);
            }
        });
    });
};

exports.create_providers = function(Name, Type, UNP, Legal_address, Actual_address, Tel, Person, Payment) {

    var providers_N = new Providers();
    providers_N.Name = Name;
    providers_N.Type = Type;
    providers_N.UNP = UNP;
    providers_N.Legal_address = Legal_address;
    providers_N.Actual_address = Actual_address;
    providers_N.Tel = Tel;
    providers_N.Person = Person;
    providers_N.Payment = Payment;
    providers_N.Rating = 0;

    return new Promise(function(resolve, reject) {
        providers_N.save(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(providers_N); //null
            }
        });
    });
};

exports.delete_provider = function(id) {
    return new Promise(function(resolve, reject) {

        Providers.findOneAndRemove({ "_id": id }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    })
};

exports.update_provider = function(Name, Type, UNP, Legal_address, Actual_address, Tel, Person, Payment, _id) {
    return new Promise(function(resolve, reject) {
        var provider_info = {
            Name: Name,
            Type: Type,
            UNP: UNP,
            Legal_address: Legal_address,
            Actual_address: Actual_address,
            Tel: Tel,
            Person: Person,
            Payment: Payment
        };

        Providers.findOneAndUpdate({ "_id": _id }, provider_info, { upsert: true, new: true, runValidators: true }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    })
};
exports.find_providers_rating = function() {
    return new Promise(function(resolve, reject) {
        resolve(Providers.find({}, { _id: 0, Rating: 1, Name: 1 }).sort({ Rating: -1 }))
    })
}