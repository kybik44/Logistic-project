const db_services = require('../model/services');
var url = require('url');
const db_country = require('../model/country_list');
const db_providers = require('../model/providers');
const db = require('mongoose')

exports.find_service = async function(req, res) {
    await db_services.find_services_id(req.params.id).then(service => {
            res.render('service', { user: req.session.user, role: req.session.role, service, customer: req.session.customer, executor: req.session.executor });
        })
        .catch(function(err) {
            //logger.log.error(err.message);
            res.redirect(303, '/error?error=' + err.message);
        });
}

exports.find_services_s = async function(req, res) {
    let providers = await db_providers.find_providers()
    db_services.find_services()
        .then(function(arr) {;
            res.render('services', { ddd: arr, user: req.session.user, role: req.session.role, providers: providers, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
        })
        .catch(function(err) {
            //logger.log.error(err.message);
            res.redirect(303, '/error?error=' + err.message);
        });
}

exports.add_services = async function(req, res) {
    var id = url.parse(req.url, true).query.id;
    db_country.find_country()
        .then(async function(countries) {
            let providers = await db_providers.find_providers()
            let customer = req.session.role == 'customer' ? true : false;
            if (id === undefined) {
                res.render('create_services', { button_name: "Добавить", Id: "", Name_form: "Добавить товар/услугу", country: countries, user: req.session.user, role: req.session.role, providers: providers, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
            }
            //   res.render('', {});
            else {
                db_services.find_services_id(id)
                    .then(async function(services) { //!!!!! заполнить поля!!

                        res.render('create_services', {
                            providers: providers,
                            user: req.session.user,
                            role: req.session.role,
                            admin: req.session.admin,
                            customer: req.session.customer,
                            executor: req.session.executor,
                            Id: id,
                            Name: services[0].Name,
                            Code: services[0].Code,
                            Unit: services[0].Unit,
                            VendorCode: services[0].VendorCode,
                            Country_of_origin: services[0].Country_of_origin,
                            Weight: services[0].Weight,
                            Service: services[0].Service,
                            button_name: "Изменить",
                            Name_form: "Редактировать товар/услугу",
                            country: countries
                        });
                    })
                    .catch(function(err) {
                        // logger.log.error(err.message);
                        res.redirect(303, '/error?error=' + err.message);
                    });
            }
        });
}

exports.save_services = function(req, res) {
    var id = req.body.ID;
    var service = (req.body.Service !== undefined) ? true : false;

    if (id !== "") {
        db_services.update_services(req.body.Name, req.body.Code, req.body.Unit, req.body.VendorCode, req.body.Country_of_origin, req.body.Weight, service, id)
            .then(function(value) {
                exports.find_services_s(req, res);
            })
            .catch(function(err) {
                //logger.log.error(err.message);
                res.redirect(303, '/error?error=' + err.message);
            });
    } else { ///поля таблицы 
        db_services.create_services(req.body.Name, req.body.Code, req.body.Unit, req.body.VendorCode, req.body.Country_of_origin, req.body.Weight, service)
            .then(function(services_N) {
                exports.find_services_s(req, res);
            })
            .catch(function(err) {
                console.log(err);
                res.redirect(303, '/error?error=' + err.message);
            });
    }
}

// exports.delete_provider = function(req, res){
//   db_providers.delete_provider(req.body.id)
//   .then (function(){
//     exports.find_providers(req,res);
//   })
//   .catch(function (err) {
//     logger.log.error(err.message);
//     res.redirect(303, '/error?error=' + err.message);
//   });
// }

exports.delete_services = async function(req, res) {
    try {
        await db_services.delete_services(req.body.id);
        res.redirect('/services'); //редирект "!!!!
        //   exports.find_providers(req,res); 
    } catch (error) {
        logger.log.error(error.message);
        res.redirect(303, '/error?error=' + error.message)
    }
}

//   db_providers.delete_provider(req.body.id)
//   .then (function(){
//     exports.find_providers(req,res);
//   })
//   .catch(function (err) {
//     logger.log.error(err.message);
//     res.redirect(303, '/error?error=' + err.message);
//   });
// }