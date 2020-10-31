var express=require("express");

var router=express.Router({mergeParams:true});

var campground=require("../models/campgrounds");
var comment=require("../models/comment");
var middleware=require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req,res){
	console.log(req.user);
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("newComment",{campground:campground})
		}
	})
})

router.post("/",middleware.isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}
				else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	})
})

router.get("/:comments_id/edit",middleware.checkCommentOwnership,function(req,res){
	comment.findById(req.params.comments_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("editComment",{campground_id:req.params.id,comment:foundComment});
		}
	})
	
	})

router.put("/:comments_id",middleware.checkCommentOwnership,function(req,res){
	comment.findByIdAndUpdate(req.params.comments_id,req.body.comment,function(err,updated){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

router.delete("/:comments_id",middleware.checkCommentOwnership,function(req,res){
	comment.findByIdAndRemove(req.params.comments_id,function(err){
							  if(err){
		res.redirect("back");
	}
	else{
		res.redirect("/campgrounds/"+req.params.id);
	}
	 })
})



module.exports=router;