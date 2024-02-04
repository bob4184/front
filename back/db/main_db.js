import mongoose from "mongoose"
import 'dotenv/config'


mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})


const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
      },
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const personSchema = new mongoose.Schema({
    name:String,
    number:Number
})

const Person = mongoose.model('Person', personSchema)

const addContent = (content) => {
    const note = new Note({
        content: content.data,
        important: content.important
    })
    return note.save();
}

const addPerson = (data) => {
    const person = new Person({
        name:data.name,
        number:data.number
    })
    return person.save()
}

export default {Note, addContent, Person, addPerson}