var express = require('express');
var router = express.Router();
var contr = require('../controllers/orders');

function IsAuthorize(req, res, next) {
    /*if (req.session.userName === "undefined" || req.session.userName == null) {
      res.redirect(303, '/authorization');
    }*/
    return next();
}

router.get('/', IsAuthorize, contr.find_orders);
//router.get('/add_auto',IsAuthorize, contr.add_car);

module.exports = router;