import express from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import cors from "cors"


const app = express()
app.use(express.json())
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons', (req, res) => {
    res.send(persons)
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    delete persons[id-1]
    res.status(200).end()
  })

  app.post('/api/persons/add', (req, res) => {
    if (req.body.name < 2) {
      res.send("Name is too short")
      throw TooShortError
    }
    for (let i of persons) {
      if (i.name == req.body.name) {
        res.send("Name already exists")
        throw AlreadyExistError
      }
    }
    const PersonsObject = {
      name: req.body.name,
      number: req.body.number
    }
    persons.push(PersonsObject)
    res.status(200).end()
  })

  app.get('/info', (req, res) => {
    res.send(`Phonebook has info of ${persons.length} people <br/> ${new Date()}`)
  })
  
  app.get('/api/notes', (request, response) => {
    response.json(notes)
  })

  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })
  
  app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: Boolean(body.important) || false,
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
  