/*
  Today I Learned webapp
*/
const assert = require('assert');
const FactStore = require('./lib/factStore')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')

app.use(cors())
app.use(express.json()) // process ANY POST request with a header "Content-Type: 'application/json"
app.use(express.static('build')) // static file server
app.use(express.urlencoded({ extended: true })) // all POST bodies are expected to be URL-encoded



const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const store = new FactStore(dbUrl);

app.get('/facts', getAll);
app.get('/fact/:ObjectID', getFact)
app.post('/facts', addFact);

async function getAll(request, response) {
  let cursor = await store.all();
  let output = [];
  cursor.forEach((entry) => {
    output.push(entry);
  }, function (err) {
    assert.equal(null, err);
    console.log("Sending " + output.length + " records to client");
    response.type('application/json')
      .send(JSON.stringify(output))
  });
}


async function getFact(request, response) {
  console.log("getting a fact...", request.params.objectID);
  let cursor = await store.one(request.params.objectId);
  let output = [];
  cursor.forEach((entry) => {
    output.push(entry);
  }, function (err) {
    assert.equal(null, err);
    console.log("Sending " + output.length + " records to client");
    response.type('application/json')
      .send(JSON.stringify(output))
  });
}

async function addFact(request, response) {
  console.log(request.body)
  let result = await store.addFact(request.body.text.trim())
  let output = {
    status: 'ok',
    id: result.id
  }
  response
    .type('application/json')
    .send(JSON.stringify(output))
}

app.listen(port, () => console.log(`TIL web app listening on port ${port}!`))
