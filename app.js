const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Load  Model
require('./models/User');
require('./models/Story');
// require('./models/Categories');
// Passport Config
require('./config/passport')(passport);

// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');
const popular = require('./routes/popular');
// const categories = require('./routes/categories');
// Load Keys
const keys = require('./config/keys');
//Handlebars Helpers
const { truncate, stripTags, formateDate, select, editIcon , ratingIcon, math, totalcount,viewcounting,checkNew} = require('./helpers/hbs');
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
app.use(Raven.requestHandler());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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
    checkNew: checkNew
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
// Set the path directory for view templates
// app.set('views', __dirname + '/public/views');
app.use(cookieParser());
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

//Set Static folder
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);
app.use('/popular', popular);
// app.use('/categories', categories);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});