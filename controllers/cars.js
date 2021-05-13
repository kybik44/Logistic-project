const db_cars = require('../model/cars');
var url = require('url');

exports.find_cars = function(req, res) {
    db_cars.find_car()
        .then(function(arr) {
            res.render('cars', { ddd: arr, admin: req.session.admin });
        })
        .catch(function(err) {
            logger.log.error(err.message);
            res.redirect(303, '/error?error=' + err.message);
        });
}

exports.find_car = async function(req, res) {
    db_cars.find_car_id(req.params.id).then(function(car) {
            res.render('car', { user: req.session.user, car, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
        })
        .catch(function(err) {
            res.redirect(303, '/error?error=' + err.message);
        });
}


exports.add_car = function(req, res) {
    var id = url.parse(req.url, true).query.id;
    if (id === undefined) {
        res.render('create_auto', { button_name: "Добавить", Id: "", Name_form: "Добавить автомобиль", user: req.session.user, role: req.session.role });
    } else {
        db_cars.find_car_id(id)
            .then(function(car) {
                res.render('create_auto', { Id: id, mdl: car[0].Model, fio_c: car[0].FIO, year: car[0].Year, Chassi: car[0].Chassis, Dir_tra: car[0].Direction_transportation, button_name: "Изменить", Name_form: "Редактировать автомобиль", user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
            })
            .catch(function(err) {
                logger.log.error(err.message);
                res.redirect(303, '/error?error=' + err.message);
            });
    }
}

exports.save_car = function(req, res) {
    var id = req.body.ID;
    if (id !== "") {
        db_cars.update_car(req.body.FIO, req.body.Model, req.body.Chassis, req.body.Year, req.body.Direction_transportation, id)
            .then(function(value) {
                exports.find_car(req, res);
            })
            .catch(function(err) {
                logger.log.error(err.message);
                res.redirect(303, '/error?error=' + err.message);
            });
    } else {
        db_cars.create_car(req.body.FIO, req.body.Model, req.body.Chassis, req.body.Year, req.body.Direction_transportation)
            .then(function(car_N) {
                exports.find_cars(req, res);
            })
            .catch(function(err) {
                res.redirect(303, '/error?error=' + err.message);
            });
    }
}

exports.delete_car = function(req, res) {
    //   //var id = url.parse(req.url, true).query.id;
    //изм
    //   try {
    //     await db_cars.find_car(req, res);
    //     res.redirect('/car');
    //   } catch (error) {
    //     logger.log.error(err.message);
    //     //     res.redirect(303, '/error?error=' + err.message);
    //   }
    // }

    db_cars.delete_car(req.body.id)
        .then(function() {
            exports.find_car(req, res);
        })
        .catch(function(err) {
            logger.log.error(err.message);
            res.redirect(303, '/error?error=' + err.message);
        });
}