const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const compression = require('compression');
// Load  Model
require('./models/User');
require('./models/Story');
require('./models/Push_Subscriber');
//require('appmetrics-dash').monitor();
// require('./models/Categories');
// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes');
const auth = require('./routes/auth');
const stories = require('./routes/stories');
const popular = require('./routes/popular');
const subscribe = require('./routes/subscribe');
const push = require('./routes/push');
const unsubscribe = require('./routes/unsubscribe');
const api = require('./routes/api');
// const categories = require('./routes/categories');
// Load Keys
const keys = require('./config/keys');
//Handlebars Helpers
const {
    truncate,
    stripTags,
    formateDate,
    select,
    editIcon,
    ratingIcon,
    math,
    totalcount,
    viewcounting,
    checkNew,
    CommentsCount,
    twitterShare,
    facebookShare,
    googleplusShare,
    pinterestShare,
    linkedinShare,
    moderateComments,
    ratingCalculate
} = require('./helpers/hbs');
var Raven = require('raven');
Raven.config('https://de8804919dea46698b2728a487303fb8@sentry.io/1272665').install();
// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURI, {
        useMongoClient: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();
app.use(compression())

// in order to serve files, you should add the two following middlewares
app.set('trust proxy', true);
app.use(Raven.requestHandler());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());


//Method override Middleware
app.use(methodOverride('_method'));

// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formateDate: formateDate,
        select: select,
        editIcon: editIcon,
        ratingIcon: ratingIcon,
        math: math,
        totalcount: totalcount,
        viewcounting: viewcounting,
        checkNew: checkNew,
        CommentsCount: CommentsCount,
        twitterShare: twitterShare,
        facebookShare: facebookShare,
        googleplusShare: googleplusShare,
        pinterestShare: pinterestShare,
        linkedinShare: linkedinShare,
        moderateComments: moderateComments,
        ratingCalculate: ratingCalculate
    },
    defaultLayout: 'main',
    partialsDir: __dirname+'/views/partials',
    layoutsDir: __dirname+'/views/layouts',
    extname: '.handlebars'
}));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', '.handlebars');
// Set the path directory for view templates

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', __dirname + '/public/js');
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});



// Use Routes

app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);
app.use('/popular', popular);
app.use('/subscribe', subscribe);
app.use('/push', push);
app.use('/unsubscribe', unsubscribe);
app.use('/api', api);
// app.use('/categories', categories);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});