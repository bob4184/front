import express from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import cors from "cors"
import db from './db/main_db.js'
import 'dotenv/config'


const app = express()
app.use(express.json())
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'))

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
}

const errorHandler = (error, request, response, next) => {
  console.log(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons', (req, res) => {
    db.Person.find({}).then(notes => {
      res.send(notes)
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
  })

  app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    db.Person.findById(id).then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
  })

  app.patch('/api/persons/:id', (req, res) => {
    const phone = req.body.phone
    db.Person.findByIdAndUpdate(req.params.id, {number: req.body.number})
    .then(done => {res.send(done)})
    .catch(error => {
      console.log(error)
      res.status(500).end()
    })
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    db.Person.deleteOne({_id: id}).then(el => {
      res.status(200)
    })
  })

  app.post('/api/persons/add', async (req, res) => {
    if (req.body.name < 2) {
      res.send("Name is too short")
      return
    }
    if (db.Person.find({name: req.body.name})) {
      res.send("Name already exists")
      return
    }
    res.send(await db.addPerson({name: req.body.name, number: req.body.number}))
  })

  app.get('/info', (req, res) => {
    res.send(`Phonebook has info of ${persons.length} people <br/> ${new Date()}`)
  })
  
  app.get('/api/notes', (request, response) => {
    db.Note.find({}).then(notes => {
      response.json(notes)
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
  })

  app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    db.Note.findById(request.params.id).then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
  })

  app.patch('/api/notes/:id', (req, res) => {
    const id = req.params.id
    db.Note.findById(id).then(note => {
      db.Note.updateOne({_id: id}, {$set: { important: !note.important }}).then(el => res.status(200))
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
  })

  app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    db.Note.deleteOne({_id: id}).then(el => {
      res.status(200)
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
  })
  
  app.post('/api/notes', async (request, response) => {
    const body = request.body
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    const op = await db.addContent({data:body.content, important:body.important})
    response.send(op)
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
  