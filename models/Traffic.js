const mongoose = require("mongoose");

// Define the Tags schema
const TrafficSchema = new mongoose.Schema({
  traffic: {
    type: Number,
    required: true,
  },
  
});

// Export the Tags model
module.exports = mongoose.model("Traffic", TrafficSchema);
