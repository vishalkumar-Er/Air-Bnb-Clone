const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner,validateListing} = require("../middileware.js");
const ExpressError = require("../utils/ExpressError.js");

const ListingController = require("..//controllers/listings.js");



router.route("/")
.get( wrapAsync(ListingController.index))
.post(
    isLoggedIn, 
    // validateListing,
    upload.single('image'),
    wrapAsync(ListingController.createListing)
);

// New Rout
router.get("/new", isLoggedIn,ListingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(ListingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single('image'),
    validateListing, 
    wrapAsync(ListingController.updateListing)
)
.delete(
    isLoggedIn,
    isOwner,
     wrapAsync(ListingController.destroyListing)
)

// Edit Rout
router.get("/:id/edit",
    isLoggedIn,
     isOwner,
     wrapAsync(ListingController.renderEditForm)
);

module.exports = router;
