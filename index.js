const express = require('express')
const connectToMongo = require('./config/db');
const multer = require('multer');
const flash = require('connect-flash');
var session = require('express-session')
var cookieParser = require('cookie-parser');
var expressLayouts = require('express-ejs-layouts');
const fs = require("fs");
const Str = require("./helpers/Str");
const mime = require('mime-types')

const app = express();
const port = process.env.PORT || 3001;
connectToMongo();
app.use(cookieParser());
app.use(session({
    secret: 'node-resume-backend-0323232323',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.set('view engine', 'ejs')
app.use(expressLayouts);
app.set('layout', 'layouts/app');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './tmp');
        },
        filename: function (req, file, cb) {
            req.body[file.fieldname] = file.originalname;
            cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9))
        }
    })
});
app.use(upload.any());


app.use(function (req, res, next) {
    res.locals.getUrl = function (path='') {
        return req.protocol + "://" + req.get('host') + '/' + path??''; 
    }
    req.getUrl = function (path='') {
        return req.protocol + "://" + req.get('host') + '/' + path??'';
    }
    res.locals.validation = req.flash('validation')[0] ?? null;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('waring');
    res.locals.info = req.flash('info');
    res.locals.message = "message from local";
    next();
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use('/', require('./routes/web'));
app.use('/api/', require('./routes/api'));

app.listen(port, (error) => {       // Listen
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port http://localhost:" + port)
    else
        console.log("Error occurred, server can't start", error);
}
);