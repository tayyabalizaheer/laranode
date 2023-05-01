var jwt = require('jsonwebtoken');

const Auth = (req, res, next) => {
    const token = req.cookies.token??"";
    // console.log("token",token);
    if (token) {
        const data = jwt.verify(token, 'salt');
        if (data && data.user){
            req.user = data.user;
            res.locals.user = data.user;
            return next();
        }
    }
    res.redirect('/login');
}

module.exports = Auth;