const express = require('express')
const app = express()
const uuid = require('uuid/v4')
const session = require('express-session')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

var path = require('path');

var parseForm = bodyParser.urlencoded({ extended: false })
const PORT = process.env.PORT || 3000;

app.use(session({
    sessId: (req) => {
        return uuid
    },
    name: 'SESS_ID',
    secret: '56j3l(*&jnkj$^%&*nb',
    resave: false,
    saveUninitialized: false
}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.use(cookieParser());

app.use(function (req, res, next) {
    console.log(req.cookies)
    var csrfCookie = req.cookies.csrf;
    if (csrfCookie === undefined)
    {
      
      var _csrfToken = uuid();
      res.cookie('_csrf',_csrfToken, { maxAge: 900000, httpOnly: false });
      console.log('csrf cookie created successfully');
    } 
    else
    {
      console.log('csrf cookie exists', csrfCookie);
    } 
    next(); 
  });


app.post('/login', parseForm, function (req, res, next) {

    if (req.session.csrfToken !== req.body._csrf) {
        console.log('Invalid CSRF Token!');
        let err = new Error('Invalid CSRF Token!')
        err.status = 403

        
        return next(err)
    }
    console.log(req)
    res.sendFile(path.join(__dirname, 'home.html'));
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})