var express=require("express");
var app=express();
var BodyParser=require("body-parser"),
mongoose=require("mongoose"),
	passport=require("passport"),
	flash=require("connect-flash")
	LocalStrategy=require("passport-local"),
methodOverride=require("method-override");
//routes
var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var authRoutes=require("./routes/index");


//config


const config=require("./config/mongo");
//config
//mongoose.connect('mongodb://localhost:27017/BlogApp');
mongoose.connect(config.database,{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
    console.log("Connected to database"+config.database);
})
mongoose.connection.on('error',(err)=>{
    console.log("Not connected"+err);
}) 
var campground=require("./models/campgrounds");
var comment=require("./models/comment");
var User=require("./models/user")
app.set("view engine","ejs");
app.use(BodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"))
app.use(methodOverride("_method"));
app.use(flash());

/*seedDB=require("./seeds");
seedDB();*/
app.use(require("express-session")({
	secret:"Anything",
	resave:false,
	saveUninitialized:false
	}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

//ROUTES

app.get("/",function(req,res){
	res.render("landing");
});

app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(authRoutes);

app.listen(process.env.PORT,function(){
	console.log("server has started");
});