const mongoose = require("mongoose");

// Define the Tags schema
const RevalidateSchema = new mongoose.Schema({
  Role: {
    type: String,
  },
  
});

// Export the Tags model
module.exports = mongoose.model("Revalidate", RevalidateSchema);
