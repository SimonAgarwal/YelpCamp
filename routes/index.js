var express=require("express");
var router=express.Router();

var passport=require("passport")
var User=require("../models/user")

router.get("/register",function(req,res){
	res.render("register");
})

router.post("/register",function(req,res){
	var newUser={
		username:req.body.username
	};
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		//if user successfully signed up
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to Yelpcamp");
			res.redirect("/campgrounds");
		})
	})
});

//login routes

router.get("/login",function(req,res){
	res.render("login");
})

router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	faliureRedirect:"/login"
}),function(req,res){
	req.flash("success", "LOGGED YOU OUT!");
})

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/campgrounds");
})
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
module.exports=router;