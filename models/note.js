// connecting to our MongoDB Atlas database
// module
// variables defined here such as: mongoose and url are not visible or accessible to users
// of the module

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// database connection URL is passed to the app via the MONGODB_URI env variable
// as hardcoding it is not a good idea!
const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url) // this one just has only param url
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: String,
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
