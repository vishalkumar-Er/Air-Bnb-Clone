const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// ================= LOGIN CHECK =================
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login"); // ✅ return very important
    }
    next();
};

// ================= SAVE REDIRECT URL =================
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};

// ================= OWNER CHECK =================
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings"); // ✅ no throw + no crash
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// ================= LISTING VALIDATION =================
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        return next(new ExpressError(400, errMsg)); // ✅ safe error handling
    }

    next();
};

// ================= REVIEW VALIDATION =================
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        return next(new ExpressError(400, errMsg)); // ✅ safe
    }

    next();
};

// ================= REVIEW AUTHOR CHECK =================
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};







































// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
// const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema} = require("./schema.js");
// const {reviewSchema} = require("./schema.js");


// module.exports.isLoggedIn = (req,res,next)=>{
//     // console.log(req.user);
//     if(!req.isAuthenticated()){
//         req.session.redirectUrl = req.originalUrl;
//         req.flash("error","you must be logged in");
//         return res.redirect("/login");
//     }
//     next();
// };

// module.exports.saveRedirectUrl = (req, res, next) => {
//   if (req.session.redirectUrl) {
//     res.locals.redirectUrl = req.session.redirectUrl;
//     delete req.session.redirectUrl; // clean after use
//   }
//   next();
// };

// module.exports.isOwner = async(req,res,next)=> {
//   const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//       throw new ExpressError(404, "Listing not found");
//     }
//     if (!listing.owner.equals(req.user._id)) {
//       req.flash("error", "You are not the owner of this listing");
//       return res.redirect(`/listings/${id}`);
//     }
//     next();
// };

// module.exports.validateListing = (req,res,next) => {
//     let {error} = listingSchema.validate(req.body);
    
//     if(error){
//         let errMsg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     } else {
//         next();
//     }
// };

// module.exports.validateReview = (req,res,next) => {
//     let {error} = reviewSchema.validate(req.body);
    
//     if(error){
//         let errMsg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     } else {
//         next();
//     }
// }


// module.exports.isReviewAuthor = async(req,res,next)=> {
//   const {id, reviewId } = req.params;
//     const review = await Review.findById(reviewId);
//     if (!review) {
//       throw new ExpressError(404, "Listing not found");
//     }
//     if (!review.author.equals(req.user._id)) {
//       req.flash("error", "You are not the author of this review");
//       return res.redirect(`/listings/${id}`);
//     }
//     next();
// };

