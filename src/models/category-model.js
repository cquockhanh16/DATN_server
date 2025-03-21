const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  category_name: {
    type: String,
    required: true,
  },
  created_at: {
    type: Number,
  },
  updated_at: {
    type: Number,
  },
});

module.exports = mongoose.model("Category", categorySchema);
