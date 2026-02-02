const express = require("express");
const router = express.Router();
const multer = require("multer");

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync.js");
const ListingController = require("../controllers/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middileware.js");

// ================= INDEX + CREATE =================
router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    wrapAsync(ListingController.createListing)
  );

// ================= NEW =================
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// ================= SHOW + UPDATE + DELETE =================
router
  .route("/:id")
  .get(wrapAsync(ListingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    wrapAsync(ListingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.destroyListing)
  );

// ================= EDIT =================
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditForm)
);

module.exports = router;
