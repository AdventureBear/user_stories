//includes
var LocalStrategy = require("passport-local"),
    methodOverride = require('method-override'),
    bodyParser  = require('body-parser'),
    passport = require("passport"),
    mongoose  = require('mongoose'),
    express   = require('express'),
    seedDB    = require('./seed'),
    app       = express()

//models
var Story =     require('./models/story'),
    Project =   require('./models/project'),
    User    =   require('./models/user')


// route includes
var   userRoutes = require('./routes/users'),
      authRoutes = require('./routes/auth'),
      projectRoutes = require('./routes/projects'),
      storyRoutes   = require('./routes/stories')


//Connect to app
mongoose.connect("mongodb://localhost/user_stories")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.set("view engine", "ejs")
seedDB()

//setup passport
app.use(require("express-session")({
  secret: "Fig is the best puppy ever",
  resave: false,
  saveUninitialized: false
}))


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  console.log("Current User: " + req.user)
  res.locals.currentUser = req.user;
  next();
});

// Route setup
app.use("/users", userRoutes)
app.use(authRoutes)
app.use("/projects", projectRoutes)
app.use("/projects/:id/stories", storyRoutes)




app.get("/", function(req,res){
  console.log("Index page")
  //console.log(req.body)
  res.render("index")
})



//SERVER
app.listen(3001, function(req, res){
  console.log("User stories server is running")
})