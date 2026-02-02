const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

async function fixMissingImages() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB ✅");

  const defaultImage = {
    filename: "",
    url: "https://images.unsplash.com/photo-1661796428215-04fc2830aae6?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const result = await Listing.updateMany(
    {
      $or: [
        { "image.url": { $exists: false } },
        { "image.url": "" },
        { image: null },
      ],
    },
    { $set: { image: defaultImage } }
  );

  console.log(`✅ Fixed ${result.modifiedCount} listings.`);
  mongoose.connection.close();
}

fixMissingImages();
