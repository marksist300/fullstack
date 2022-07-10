const express = require("express");
const app = express();
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
      "name": "Jeap Pierre Baptiste", 
      "number": "42-12-235564"
    }
]

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
  console.log('called')
  return new Date().toUTCString();
}

app.get("/info", (req,res)=>{
  res.send(`<p>Phonebook has info for ${dataIdCounter(data)} people</p>\n\n<p>${dateLog()}</p>`);
})

app.get("/api/persons/:num", (req, res)=>{
  let idNum = req.params.num;
  // res.send(`<h1>${idNum}</h1>`);
  console.log(data.find(item=> item["id"] ==idNum))
  if(!data.find(item=> item["id"] ==idNum)){
    res.status(404).send(`<h1>Person Not Found</h1>`);
  }
  else if (data.find(item=> item["id"] ==idNum)) {
    res.send(`<h1>${idNum}: ${JSON.stringify(data.find(item=> item["id"]== idNum))}</h1>`)
  }

})

app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`);
})