var express = require("express");
var hbs = require("hbs");
var path = require("path");
var session = require("express-session");
var methodOverride = require("method-override");
var fetch = require("node-fetch");
require('./utils/hbsHelpers');
require('./db');

var userNormalRoutes = require('./routes/normalRoutes/userNormalRoutes');
var blogNormalRoutes = require('./routes/normalRoutes/blogNormalRoutes');
var userApiRoutes = require('./routes/apiRoutes/userApiRoutes');
var blogApiRoutes = require('./routes/apiRoutes/blogApiRoutes');

var app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views", "pages"));
app.set("view options", { layout: "../layouts/main" });
hbs.registerPartials(path.join(__dirname, "views", "partials"));
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: "random1234",
        resave: false,
        name: "blogSession",
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        }
    })
);

app.use(methodOverride('_method'));
//routes
app.use(userNormalRoutes);
app.use(blogNormalRoutes);
app.use(userApiRoutes);
app.use(blogApiRoutes);

app.use('/', function (req,res) {
    var blogs = fetch('http://localhost:8080/blogs')
    .then(function (blogs) {
        return blogs.json();
    })
    .then(function (blogs) {
        res.render('home', {title : "Blogggieee", blogs, type : "home", isAuth : req.session.userId});
    })
});

app.listen(8080, function () {
    console.log("Server started");
});
