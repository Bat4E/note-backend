/*
Main purpose of the server is to returned raw data in JSON format to the frontend
You can shutdown server by pressing: Ctrl+C
*/

/*
node-repl = interactive environment you can use in the terminal to test node commands of your application
type node in the command line in order to use node-repl
*/

const express = require("express"); // importing express
const app = express(); // express function used to create an express application

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

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

const cors = require("cors"); // middleware that allows request from all origins

app.use(cors());

app.use(express.json()); // express json-parser "command" it is also a middleware

app.use(requestLogger); // middleware function, needs to be used after our parser

// a route with an event handler to handle HTTP GET requests to the '/' aka root of the application
// the event handler accepts two parameters: 1st one contains all the info of the HTTP request
// the 2nd one is used to define how the request is responded
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>"); // since it's a string, express automatically sets the value of Content-Type to text/html
});

app.get("/api/notes", (request, response) => {
  response.json(notes); // since it's a JSON string, express automatically sets the value of Content-Type to application/json
});

// route for an individual note
// using the colon : express syntax to define a parameter in routes (:id) is a parameter
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end(); // does not send any data, just a status message
  }
});

/* 
The JSON-parser takes the JSON data of a request,
transforms it into JS object and then
attaches it to the body property of the request object before
the route handler is called
*/

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0; // using the spread syntax ...notes, transforms the array into individual items (aka numbers)
  return String(maxId + 1);
};

// without the json-parser from app.use(express.json()) the body property (data) would be undefined
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

// middleware function to catch when no router handler processes the HTTP requests
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001; // environment variable PORT or 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
