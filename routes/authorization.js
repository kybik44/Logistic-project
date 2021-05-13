//module autorization

exports.registration_form = function(req, res) {
    if (req.session.userName == "undefined" || req.session.userName == null) {
        res.render('/registration');
    } else
        res.redirect(303, '/');

};

exports.registration_post = function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
    var role = req.body.role;
}