const validator = require('../helpers/validate');
const login = async (req, res, next) => {
    const validationRule = {
        "email": "required|string|email",
        "password": "required|string|min:6",
    };
    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {

            req.flash('validation', err.errors)
            res.redirect('back');
        } else {
            next();
        }
    }).catch(err => console.log(err))
}
module.exports = login;