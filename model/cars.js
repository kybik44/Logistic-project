var mongoose = require('mongoose');

var carsSchema = new mongoose.Schema({
    FIO: {
        type: String,
        minlength: 10,
        maxlength: 300
    },

    Model: {
        type: String,
        required: true
    },

    Chassis: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 20
    },

    Year: {
        type: Number,
        required: true,
        min: 2010
    },

    Direction_transportation: {
        type: String
    }
});

var Car = mongoose.model('cars', carsSchema); //var
exports.cars = Car
exports.find_car = function() {
    return new Promise(function(resolve, reject) { //
        Car.find({}, function(err, cars) {
            if (err) { reject(err); } else {
                resolve(cars);
            }
        });
    });
};

exports.find_car_id = function(_id) {
    return new Promise(function(resolve, reject) { //
        Car.find({ "_id": _id }, function(err, car) {
            if (err) { reject(err); } else {
                resolve(car);
            }
        });
    });
};

exports.create_car = function(FIO, Model, Chassis, Year, Direction_transportation, Edit) {

    var car_N = new Car();
    car_N.FIO = FIO;
    car_N.Model = Model;
    car_N.Chassis = Chassis;
    car_N.Year = Year;
    car_N.Direction_transportation = Direction_transportation;
    car_N.Edit = Edit;

    return new Promise(function(resolve, reject) {
        car_N.save(function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(car_N); //null
            }
        });
    });
};

exports.update_car = function(FIO, Model, Chassis, Year, Direction_transportation, _id) {
    return new Promise(function(resolve, reject) {
        var car_info = {
            FIO: FIO,
            Model: Model,
            Chassis: Chassis,
            Year: Year,
            Direction_transportation: Direction_transportation
        };

        Car.findOneAndUpdate({ "_id": _id }, car_info, { upsert: true, new: true, runValidators: true }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    })
};

exports.delete_car = function(id) {
    return new Promise(function(resolve, reject) {

        Car.findOneAndRemove({ "_id": id }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(null);
            }
        });
    })
};