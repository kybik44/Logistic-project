const db_customers = require('../model/customers');
var url = require('url');

exports.find_customers = function(req, res) {
    db_customers.find_customers()
        .then(function(arr) {
            res.render('customers', { ddd: arr, username: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
        })
        .catch(function(err) {
            logger.log.error(err.message);
            res.redirect(303, '/error?error=' + err.message);
        });
}

exports.find_customer = async function(req, res) {
    await db_customers.find_customer_id(req.params.id).then(customer => {
            res.render('customer', { user: req.session.user, role: req.session.role, data: customer, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
        })
        .catch(function(err) {
            //logger.log.error(err.message);
            res.redirect(303, '/error?error=' + err.message);
        });
}

exports.add_customers = function(req, res) {
    var id = url.parse(req.url, true).query.id;
    if (id === undefined) {
        res.render('create_customers', { button_name: "Добавить", Id: "", Name_form: "Добавить клиента", user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
    } else {
        db_customers.find_customer_id(id)
            .then(function(customer) {
                res.render('create_customers', { Id: id, Name: customer[0].Name, Type: customer[0].Type, UNP: customer[0].UNP, Legal_address: customer[0].Legal_address, Actual_address: customer[0].Actual_address, Tel: customer[0].Tel, Person: customer[0].Person, button_name: "Изменить", Name_form: "Редактировать клиента", user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
            })
            .catch(function(err) {
                // logger.log.error(err.message);
                res.redirect(303, '/error?error=' + err.message);
            });
    }
}

exports.save_customers = function(req, res) {
    var id = req.body.ID;
    if (id !== "") {
        db_customers.update_customer(req.body.Name, req.body.Type, req.body.UNP, req.body.Legal_address, req.body.Actual_address, req.body.Tel, req.body.Person, id)
            .then(function(value) {
                exports.find_customers(req, res);
            })
            .catch(function(err) {
                logger.log.error(err.message);
                res.redirect(303, '/error?error=' + err.message);
            });
    } else {
        db_customers.create_customers(req.body.Name, req.body.Type, req.body.UNP, req.body.Legal_address, req.body.Actual_address, req.body.Tel, req.body.Person)
            .then(function(customer_N) {
                exports.find_customers(req, res);
            })
            .catch(function(err) {
                console.log(err);
            });
    }
}

exports.delete_customer = function(req, res) {
    db_customers.delete_customer(req.body.id)
        .then(function() {
            exports.find_customers(req, res);
        })
        .catch(function(err) {
            logger.log.error(err.message);
            res.redirect(303, '/error?error=' + err.message);
        });
}