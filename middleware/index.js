var campground=require("../models/campgrounds");
var comment=require("../models/comment")

var middlewareObj={};
middlewareObj.checkCampgroundOwnership=function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated()){
		campground.findById(req.params.id,function(err,found){
			if(err){
				req.flash("error","Campground not found");
				res.redirect("back");
			}
			else{
				if(found.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error","You dont have permission to do that");
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error","You need to be Logged in");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership=function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
		comment.findById(req.params.comments_id,function(err,found){
			if(err){
				req.flash("error","Something went wrong");
				res.redirect("back");
			}
			else{
				if(found.author.id.equals(req.user._id)){
					
					next();
				}
				else{
					req.flash("error","No Permission");
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("Please Login First");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn=function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		
		return next();
	}
	req.flash("error","Please login first");
	res.redirect("/login");
}

module.exports=middlewareObj;