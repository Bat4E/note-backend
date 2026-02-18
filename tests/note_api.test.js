/* We're using Supertest because it provides:
if the server is not already listening for connections then it is bound to
an ephemeral port for you so there is no need to keep track of ports.
Supertest takes care that the application being tested is started
at the port that it uses internally.
*/

// initializing the database before every test with the beforeEach function

const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Note = require("../models/note");

const api = supertest(app);

const initialNotes = [
  {
    content: "HTML is easy",
    important: false,
  },
  {
    content: "Browser can execute only JavaScript",
    important: true,
  },
];

beforeEach(async () => {
  await Note.deleteMany({}); // clear database initially
  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();
  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/); // regex
});

test("all notes are returned", async () => {
  const response = await api.get("/api/notes");

  // execution gets here only after the HTTP request is complete
  // the result of HTTP request is saved in a variable response (applies to all async/await)
  assert.strictEqual(response.body.length, initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");

  const contents = response.body.map((e) => e.content);
  assert(contents.includes("HTML is easy"));
});

after(async () => {
  await mongoose.connection.close();
});
