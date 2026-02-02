const Listing = require("../models/listing");
const mongoose = require("mongoose");

// ================= INDEX =================
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// ================= NEW FORM =================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// ================= SHOW =================
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Listing ID");
    return res.redirect("/listings");
  }

  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// ================= CREATE (🔥 FIXED) =================
module.exports.createListing = async (req, res) => {
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else {
    listing.image = {
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      filename: "default",
    };
  }

  await listing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// ================= EDIT FORM =================
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const originalImageUrl = listing.image.url.replace(
    "/upload",
    "/upload/w_300"
  );

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// ================= UPDATE =================
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    { new: true }
  );

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

// ================= DELETE =================
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};































































































































// const ExpressError = require("../utils/ExpressError");
// const Listing = require("../models/listing");
// const mongoose = require("mongoose");
// const express = require("express");


// module.exports.index = async (req,res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// };

// module.exports.renderNewForm = (req, res) => {
//     res.render("listings/new.ejs");
// };

// module.exports.showListing = async (req, res) => {
//     const { id } = req.params;

//     // agar id valid ObjectId nahi hai
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new ExpressError(404, "Page Not Found");
//     }

//     const listing = await Listing.findById(id)
//     .populate({path:"reviews",
//         populate:{
//             path: "author",
//         },
//     })
//     .populate("owner");
//     if(!listing){
//         req.flash("error","Listing you requested for does not exist");
//     }
//     // agar id valid hai but listing exist nahi karti
//     if (!listing) {
//         throw new ExpressError(404, "Page Not Found");
//         req.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs", { listing });
// };

// module.exports.createListing = async (req, res) => {
//     let url = req.file.path;
//     let filename = req.file.filename;

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = {url,filename};
//     await newListing.save();
//     req.flash("success","New listing created !");
//     res.redirect("/listings");
// };

// module.exports.renderEditForm = async (req,res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     if(!listing){
//         throw new ExpressError(404,"Listing not found");
//     }
//     let originalImageUrl = listing.image.url;
//     originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
//     res.render("listings/edit.ejs",{listing , originalImageUrl});
// };

// module.exports.updateListing = async (req, res) => {
//   let { id } = req.params;

//   const listing = await Listing.findByIdAndUpdate(
//     id,
//     { ...req.body.listing },
//     { new: true }
//   );

//   if (!listing) {
//     req.flash("error", "Listing not found");
//     return res.redirect("/listings");
//   }

//   if (req.file) {
//     let url = req.file.path;
//     let filename = req.file.filename;

//     listing.image = { url, filename };
//     await listing.save();
//   }

//   req.flash("success", "Listing updated!");
//   res.redirect(`/listings/${id}`);
// };


// module.exports.destroyListing = async (req,res) => {
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success","listing Deleted !");
//     res.redirect("/listings");
// }

