/*
Main purpose of the server is to returned raw data in JSON format to the frontend
You can shutdown server by pressing: Ctrl+C
*/

/*
node-repl = interactive environment you can use in the terminal to test node commands of your application
type node in the command line in order to use node-repl
*/

require("dotenv").config(); // needs to be imported before the importing the model note
const express = require("express"); // importing express
const Note = require("./models/note"); // assigns to Note the same object that the module defines

const app = express(); // express function used to create an express application

let notes = [];

// if multiple middleware are used, they are executed by the order they are used
// Middleware functions have to be used before routes when we want them to be executed by the route event handlers.
// Only use Middleware functions after routes when no route handler processes the HTTP requests

// custom middleware function
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next(); // this function yields control to the next middleware
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    // the error was caused by an invalid object id for Mongo
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// no longer needed, since we have a proxy (cors)
// const cors = require("cors"); // middleware that allows request from all origins
// the execution order of middleware is the same as the order that they are loaded into Express
// with the app.use function.

// app.use(cors()); // no longer needed, since we have a proxy

app.use(express.static("dist"));
app.use(express.json()); // express json-parser "command" it is also a middleware
app.use(requestLogger); // middleware function, needs to be used after our parser

// a route with an event handler to handle HTTP GET requests to the '/' aka root of the application
// the event handler accepts two parameters: 1st one contains all the info of the HTTP request
// the 2nd one is used to define how the request is responded
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>"); // since it's a string, express automatically sets the value of Content-Type to text/html
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes); // since it's a JSON string, express automatically sets the value of Content-Type to application/json
  });
});

// route for an individual note
// using the colon : express syntax to define a parameter in routes (:id) is a parameter
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error); // continues to the error handler middleware
    });
});

/*
The JSON-parser takes the JSON data of a request,
transforms it into JS object and then
attaches it to the body property of the request object before
the route handler is called
*/

// without the json-parser from app.use(express.json()) the body property (data) would be undefined
app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

// updating one note
app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  // nested promises in other words, chained promises
  Note.findById(request.params.id) // note fetched from the database using findById method
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      note.content = content;
      note.important = important;

      return note.save().then((updatedNote) => {
        // http request responds by sending the updated note in the response
        response.json(updatedNote);
      });
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      // result could be used to check if a resource was actually deleted
      response.status(204).end(); // status code 204 -> no content
    })
    .catch((error) => next(error)); // any exceptions passed to the next handler
});

// middleware function to catch when no router handler processes the HTTP requests
// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// needs to loaded after all endpoints have been defined
app.use(unknownEndpoint);

// this has to be the last loaded middleware, also all the routes should be registered before this!
// handler of requests that result in errors
app.use(errorHandler);

const PORT = process.env.PORT; // environment variable PORT or 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
