// require library
const express=require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app=express();
app.use(express.urlencoded());
app.use(cookieParser()); 
//connecting to database
const db = require('./config/mongoose');
const TODO = require('./models/todolist');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const flash=require('connect-flash');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const flashmiddleware=require('./config/middleware');
const expressLayouts = require('express-ejs-layouts');
const sassMiddleware =require('node-sass-middleware');

// connecting to veiw engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
//connecting to static assets
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/assets'));
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'todolist',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100000)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(flash());
app.use(flashmiddleware.setflash);
// connecting to routes
app.use('/',require('./routes/index'));
// fire up the server
app.listen(process.env.PORT || 3601,function(err){
    if(err){
        console.log(`Error ${err}`);
        return;
    }
    console.log(`Running fine on port ${process.env.PORT || 3601}`);
});
