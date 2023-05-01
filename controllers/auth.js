const Validator = require('validatorjs');
const User = require('../models/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.login = function (req, res) {
    console.log(req.cookies);
    if (req.cookies?.token){
        res.redirect('/dashboard');
    }
    res.render('login',{
        layout: "./layouts/auth"
    });
};

exports.logout = function (req, res) {
    res.clearCookie('token');
    req.flash('success', "Logout");
    res.redirect('/login');
};
exports.loginPost = async function (req, res) {
    const { password , email } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        const comparePassword = await bcrypt.compare(password, user.password);
        if (comparePassword) {
            var authToken = jwt.sign({ user }, 'salt');
            res.cookie('token', authToken, { maxAge: 1000 * 60 * 60 * 60 *365 });
            req.flash('success', "Login to dashboard");
            res.redirect('/dashboard');
        }

    }else{
        req.flash('error', "Credentials don't match");
        res.redirect('login');

    }
    res.redirect('/login');
}

exports.register = function (req, res) {
    console.log(req.cookies);
    if (req.cookies?.token) {
        res.redirect('/dashboard');
    }
    res.render('register', {
        layout: "./layouts/auth"
    });
};

exports.registerPost = async function (req, res) {
    var inputs = req.body;
    console.log(inputs, inputs.password);
    inputs.password = await bcrypt.hash(inputs.password,'salt');
    User.create(inputs).then(
        data => {
            res.redirect('/dashboard');
        }
    ).catch(
        error => {
            res.redirect('back');
        }
    );
    if (req.cookies?.token) {
        res.redirect('/dashboard');
    }
    res.redirect('/dashboard');
};