var mongoose = require('mongoose');
var Customers = require('../model/customers');

var customersSchema = new mongoose.Schema({
    Name: {
        type: String,
        minlength: 5,
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
    }
});

var Customers = mongoose.model('customers', customersSchema); //var
exports.customers = Customers
exports.find_customers = function() {
    return new Promise(function(resolve, reject) { //
        Customers.find({}, function(err, customers) {
            if (err) { reject(err); } else {
                resolve(customers);
            }
        });
    });
};

exports.find_customer_id = function(_id) {
    return new Promise(function(resolve, reject) { //
        Customers.find({ "_id": _id }, function(err, customers) {
            if (err) { reject(err); } else { resolve(customers); }
        });
    });
};

exports.create_customers = function(Name, Type, UNP, Legal_address, Actual_address, Tel, Person) {

    var customer_N = new Customers();
    customer_N.Name = Name;
    customer_N.Type = Type;
    customer_N.UNP = UNP;
    customer_N.Legal_address = Legal_address;
    customer_N.Actual_address = Actual_address;
    customer_N.Tel = Tel;
    customer_N.Person = Person;

    return new Promise(function(resolve, reject) {
        customer_N.save(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(customer_N); //null
            }
        });
    });
};

exports.delete_customer = function(id) {
    return new Promise(function(resolve, reject) {

        Customers.findOneAndRemove({ "_id": id }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    })
};

exports.update_customer = function(Name, Type, UNP, Legal_address, Actual_address, Tel, Person, _id) {
    return new Promise(function(resolve, reject) {
        var customer_info = {
            Name: Name,
            Type: Type,
            UNP: UNP,
            Legal_address: Legal_address,
            Actual_address: Actual_address,
            Tel: Tel,
            Person: Person
        };

        Customers.findOneAndUpdate({ "_id": _id }, customer_info, { upsert: true, new: true, runValidators: true }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    })
};