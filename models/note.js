// connecting to our MongoDB Atlas database
// module
// variables defined here such as: mongoose and url are not visible or accessible to users
// of the module

/*
Will only define the Mongoose schema for notes
*/

const mongoose = require("mongoose");

// Mongoose has its own validation
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
