var express=require("express");
var router=express.Router();

var campground=require("../models/campgrounds");
var middleware=require("../middleware");


router.get("/",function(req,res){
	campground.find({},function(err,campgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds",{campgrounds:campgrounds});
}
	})

});
router.post("/",middleware.isLoggedIn,function(req,res){
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description
	var newCampground={
		name:name,
		image:image,
		description:description,
		author:author
	};
	campground.create(newCampground,function(err,newlyCreated){
		if(err){
console.log(err);
		}
		else{
			res.redirect("/campgrounds");
}
	})
	
	
});
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("new");
})
//SHOW route
router.get("/:id",function(req,res){
	campground.findById(req.params.id).populate("comments").exec(function(err,found){
		if(err){
			console.log(err);
		}
		else{
			
res.render("show",{campground:found});
		}
	})
})
//update and edit routes
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	campground.findById(req.params.id,function(err,found){
		
			res.render("campgroundEdit.ejs",{campground:found});
		
	})
	
})

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})
//delete campgrounds
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
})



module.exports=router;