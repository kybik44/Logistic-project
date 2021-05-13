var user = require('../model/users');
var regist = require('../routes/registration');
var { customers } = require('../model/customers')
const { providers } = require('../model/providers')
const { cars } = require('../model/cars')
const { services } = require('../model/services')
exports.controller_post = function(req, res) {
    user.find_user_f(req.body.login, req.body.password)
        .then(function(obj) {
            console.log(obj)
            if (obj.length == 1) {
                if (obj[0].validPassword(req.body.password)) {
                    req.session.user = obj[0]._id;
                    if (obj[0].role == 'customer') {
                        req.session.role = 'customer'
                        req.session.customer = true
                        req.session.executor = false
                        req.session.admin = false
                    } else if (obj[0].role == 'executor') {
                        req.session.role = 'executor'
                        req.session.executor = true
                        req.session.customer = false
                        req.session.admin = false
                    } else if (obj[0].role == 'admin') {
                        req.session.role = 'admin'
                        req.session.executor = false
                        req.session.customer = false
                        req.session.admin = true
                    }
                    console.log(req.session)
                    res.render('home', { title: 'Express', user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin })
                } //проверка пароля){}
                else
                    res.render('error', { message: "Неверный логин или пароль" });
            }
            if (obj.length == 0) {
                res.render('error', { message: "Пользователь не найден." }); //ошибка
                /*req.session.userName = req.body.login;
                req.session.role = obj[0].role
                res.render('home', { title: 'Express', user: req.session.userName, role: req.session.role })*/
            }
            if (obj.length == 2) {
                res.render('error', { message: "Пользователь забудлирован." }); //ошибка
            }
            //console.log(obj); // 0 1 2  проверка массива! 
        })
        .catch(function(err) {
            console.log(err);
            //logger.log.error(err.message);
            //res.redirect(303, '/error?error=' + err.message);
        });
};

//создание пользователя
exports.user_registration = function(req, res) {
    console.log(req.body)
    if (req.body.role == 'undefined') {
        res.render('error', { message: "Вы не выбрали роль. Пройдите регистрацию снова" });
    } else
        user.user_registration_create(req.body.email, req.body.login, req.body.password, req.body.role)
        .then(function(user_N) {
            user.find_user_f(req.body.login, req.body.password)
                .then(function(obj) {
                    console.log(obj)
                    if (obj.length == 1) {
                        if (obj[0].validPassword(req.body.password)) {
                            req.session.user = obj[0]._id;
                            if (obj[0].role == 'customer') {
                                req.session.role = 'customer'
                                req.session.customer = true
                                req.session.executor = false
                                req.session.admin = false
                            } else if (obj[0].role == 'executor') {
                                req.session.role = 'executor'
                                req.session.executor = true
                                req.session.customer = false
                                req.session.admin = false
                            } else if (obj[0].role == 'admin') {
                                req.session.role = 'admin'
                                req.session.executor = false
                                req.session.customer = false
                                req.session.admin = true
                            }
                            console.log(req.session)
                            res.render('home', { title: 'Express', user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin })
                        }
                    }
                })
        })
}



exports.controller_authorization = function(req, res, next) {
    res.render('authorization', { layout: null, user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
};

exports.controller_registration = function(req, res, next) {
    res.render('registration', { layout: null, user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
};
exports.controller_filter = function(req, res) {
    res.render('filter', { user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin })
}

exports.filter_data = async function(req, res) {
    console.log(req.query)
    let query = req.query
    let searchParams = new Object()
    for (let [key, value] of Object.entries(query)) {
        let separator = req.query.type + '_'
        let dbField = key.split(separator) // разбитие по регулярному выражению, чтобы отделить тип сущности от поля в бд, см.шаблон и формат полей БД
        if (key != 'type' && value !== '') {
            searchParams[dbField[1]] = value
        }
    } // не берем 1 параметр, т.к это тип фильтра
    let data
    switch (req.query.type) {
        case 'provider':
            data = await providers.find(searchParams)
            res.render('filter_data', { user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, data, section: req.query.type })
            break
        case 'customer':
            data = await customers.find(searchParams)
            console.log(data)
            res.render('filter_data', { user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, data, section: req.query.type })
            break
        case 'car':
            data = await cars.find(searchParams)
            res.render('filter_data', { user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, data, section: req.query.type })
            break
        case 'service':
            data = await services.find(searchParams)
            res.render('filter_data', { user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, data, section: req.query.type })
            break
    }
}