const Listing = require("../models/listing");
const Review = require("../models/review");
const express = require("express");

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    await newReview.save();
    await listing.save();
    req.flash("success","New review created !");

    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async (req,res) =>{
        let {id , reviewId} = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted !");
        res.redirect(`/listings/${id}`);
};  

