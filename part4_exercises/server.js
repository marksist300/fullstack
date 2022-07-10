const express = require("express");
const app = express();
const body = require("body-parser");
const PORT = 3001;
const morgan = require("morgan");

const data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": 5,
      "name": "Jean Pierre Baptiste", 
      "number": "42-12-235564"
    }
]
//app.use command, needed for the later post requests in json format and middleware use
app.use(express.json());

// app.use(morgan("tiny"));
//Setting up morgan 'token' to output the post data when sent
morgan.token('postBody', (req,res)=>{
  return JSON.stringify(req.body);
})
//outputting various data about the post request as well as finally the token containing the actual data sent to the server.
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))
//basic get request to output json data back to the user:
app.get("/api/persons", (req,res)=>{
    res.json(data);
})

//function to count the number of ids and therefore people in the data set.
function dataIdCounter(data) {
  let count = 0;
  data.map(item=> {
      if(item["id"]) count++
    })
  return count;
}

const dateLog = ()=>{
  return new Date().toUTCString();
}
//out puts data about the overall size of the phonebook using the above functions.
app.get("/info", (req,res)=>{
  res.send(`<p>Phonebook has info for ${dataIdCounter(data)} people</p>\n\n<p>${dateLog()}</p>`);
})


//takes request paramaters from the user and searches through the data to match to a person.
app.get("/api/persons/:num", (req, res)=>{
  let idNum = req.params.num;
  if(!data.find(item=> item["id"] ==idNum)){
    res.status(404).send(`<h1>Person Not Found</h1>`).end();
  }
  else if (data.find(item=> item["id"] ==idNum)) {
    res.send(`<h1>${idNum}: ${JSON.stringify(data.find(item=> item["id"]== idNum))}</h1>`)
  }
})


// Delete request
app.delete("/api/delete/persons/:num", (req,res)=>{
  let idNum = req.params.num;
  if(!data.find(item=> item["id"] == idNum)){
    res.status(404).send(`<h1>Nothing deleted: Person Not Found</h1>`).end();
  }
  else {
    if(data.filter(item=> item["id"] == idNum)){
      delete data[idNum-1]
    }
    res.status(204).send(`<h1>ID: ${idNum} deleted</h1>`).end();
    console.log(`ID: ${idNum} deleted`)
  }
})

//functions to be utilised in the API post request. The Math.random id genertaor created in line with the project outlines/instructions
// there are definitely better and more elegant ways of dealing with the id structure.
function generateId(min=5, max = 2000){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function checkName(newName){
  if(data.find(person=> person.name == newName) != undefined) return true
}

app.post("/api/persons", (req,res)=>{
  const person = req.body;
  if(person.name == '' || person.number == ''){
    return res.status(400).json({
      error: "content missing"
    });
  } else if (checkName(person.name) == true){
    return res.status(400).json({
      error: "Name already exists"
    })
  }

  let updatePersons = {
    id: generateId(),
    name: person.name,
    number: person.number
  }

  data.push(updatePersons)

  res.json(data)
})

app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`);
})