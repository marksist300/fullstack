const express = require("express");
const app = express();
const body = require("body-parser")
const PORT = 3001;

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
app.use(express.json())
app.get("/api/persons", (req,res)=>{
    res.json(data);
})

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

app.get("/info", (req,res)=>{
  res.send(`<p>Phonebook has info for ${dataIdCounter(data)} people</p>\n\n<p>${dateLog()}</p>`);
})

app.get("/api/persons/:num", (req, res)=>{
  let idNum = req.params.num;
  if(!data.find(item=> item["id"] ==idNum)){
    res.status(404).send(`<h1>Person Not Found</h1>`).end();
  }
  else if (data.find(item=> item["id"] ==idNum)) {
    res.send(`<h1>${idNum}: ${JSON.stringify(data.find(item=> item["id"]== idNum))}</h1>`)
  }
})

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

function generateId(min=5, max = 2000){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function checkName(newName){
  if(data.find(person=> person.name == newName) != undefined) return true

}
console.log(checkName('Jean Pierre Baptiste'))

app.post("/api/persons", (req,res)=>{
  const person = req.body;
  console.log(person)
  if(person.name == '' || person.number == ''){
    console.log(person.name)
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