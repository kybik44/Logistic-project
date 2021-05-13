var express = require('express');
var router = express.Router();
var contr = require('../controllers/services');

function IsAuthorize(req, res, next) {
    /*if (req.session.userName === "undefined" || req.session.userName == null) {
      res.redirect(303, '/authorization');
    }
    else*/
    return next();
}

router.get('/', IsAuthorize, contr.find_services_s);
router.get('/:id', IsAuthorize, contr.find_service)
    //router.get('/add_auto',IsAuthorize, contr.add_car);

router.post('/delete_services', IsAuthorize, contr.delete_services);

module.exports = router;