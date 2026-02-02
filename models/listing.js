const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref: "Review",
    }
  ],
 owner: {
  type: Schema.Types.ObjectId,
  ref: "User",
},

});

// listingSchema.pre("save", function (next) {
//   if (!this.image || !this.image.url) {
//     this.image = {
//       filename: "",
//       url: "https://images.unsplash.com/photo-1661796428215-04fc2830aae6?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     };
//   }
//   next();
// });

listingSchema.post("findOneAndDelete", async(listing) =>{
  if(listing){
    await Review.deleteMany({_id :{$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
