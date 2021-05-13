const db_providers = require('../model/providers');

var url = require('url');

exports.find_providers = function(req, res) {
    db_providers.find_providers()
        .then(function(arr) {
            res.render('providers', { ddd: arr, user: req.session.user, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
        })
        .catch(function(err) {
            res.redirect(303, '/error?error=' + err.message);
        });
}

exports.find_provider = function(req, res) {
    db_providers.find_provider_id(req.params.id).then(function(provider) {
            res.render('provider', { user: req.session.user, customer: req.session.customer, executor: req.session.executor, provider, admin: req.session.admin });
        })
        .catch(function(err) {
            res.redirect(303, '/error?error=' + err.message);
        });
}

exports.add_providers = function(req, res) {
    var id = url.parse(req.url, true).query.id;
    if (id === undefined) {
        res.render('create_providers', { button_name: "Добавить", Id: "", Name_form: "Добавить поставщика", user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin, admin: req.session.admin });
    }
    //   res.render('', {});
    else {
        db_providers.find_provider_id(id)
            .then(function(provider) {
                res.render('create_providers', { Id: id, Name: provider[0].Name, Type: provider[0].Type, UNP: provider[0].UNP, Legal_address: provider[0].Legal_address, Actual_address: provider[0].Actual_address, Tel: provider[0].Tel, Person: provider[0].Person, Payment: provider[0].Payment, button_name: "Изменить", Name_form: "Редактировать поставщика", user: req.session.user, role: req.session.role, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin });
            })
            .catch(function(err) {
                logger.log.error(err.message);
                res.redirect(303, '/error?error=' + err.message);
            });
    }
}

exports.save_providers = function(req, res) {
    var id = req.body.ID;
    if (id !== "") {
        db_providers.update_provider(req.body.Name, req.body.Type, req.body.UNP, req.body.Legal_address, req.body.Actual_address, req.body.Tel, req.body.Person, req.body.Payment, id)
            .then(function(value) {
                exports.find_providers(req, res);
            })
            .catch(function(err) {
                logger.log.error(err.message);
                res.redirect(303, '/error?error=' + err.message);
            });
    } else {
        db_providers.create_providers(req.body.Name, req.body.Type, req.body.UNP, req.body.Legal_address, req.body.Actual_address, req.body.Tel, req.body.Person, req.body.Payment)
            .then(function(provider_N) {
                exports.find_providers(req, res);
            })
            .catch(function(err) {
                console.log(err);
            });
    }
}

exports.delete_provider = async function(req, res) {
    try {
        await db_providers.delete_provider(req.body.id);
        res.redirect('/providers'); //редирект "!!!!
        //   exports.find_providers(req,res); 
    } catch (error) {
        logger.log.error(error.message);
        res.redirect(303, '/error?error=' + error.message)
    }
}

exports.get_providers_raiting = async function(req, res) {
    await db_providers.find_providers_rating().then(data => res.render('providers_raiting', { user: req.session.user, role: req.session.role, table: data, customer: req.session.customer, executor: req.session.executor, admin: req.session.admin }))
}

exports.get_ratings = async function(req, res) {
    let data = await db_providers.find_providers_rating().then(response => res.send(response))

}