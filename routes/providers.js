var express = require('express');
var router = express.Router();
var contr = require('../controllers/providers');

function IsAuthorize(req, res, next) {
    /*if (req.session.userName === "undefined" || req.session.userName == null) {
      res.redirect(303, '/authorization');
    }
    else*/
    return next();
}

router.get('/', IsAuthorize, contr.find_providers);
//router.get('/add_auto',IsAuthorize, contr.add_car);
router.get('/:id', IsAuthorize, contr.find_provider)

router.post('/delete_provider', IsAuthorize, contr.delete_provider);

module.exports = router;