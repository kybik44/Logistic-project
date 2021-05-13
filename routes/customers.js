var express = require('express');
var router = express.Router();
var contr = require('../controllers/customers');

function IsAuthorize(req, res, next) {
    /*if (req.session.userName === "undefined" || req.session.userName == null) {
      res.redirect(303, '/authorization');
    }*/
    return next();
}

router.get('/', IsAuthorize, contr.find_customers);
router.get('/:id', IsAuthorize, contr.find_customer);
//router.get('/add_auto',IsAuthorize, contr.add_car);

module.exports = router;