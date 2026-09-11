const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

// TODO(3.12): ganti dengan user + host Atlas kamu.
// Contoh: mongodb+srv://phonebookuser:<password>@cluster0.abc123.mongodb.net/phonebook?retryWrites=true&w=majority
// Password JANGAN di-hardcode — selalu lewat argv.
const url = `mongodb+srv://kenzamariyan:${password}@cluster0.cjc8uee.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log('phonebook:')
    persons.forEach((p) => console.log(p.name, p.number))
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('usage: node mongo.js <password> [name number]')
  process.exit(1)
}
