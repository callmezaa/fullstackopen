const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

// Atlas standard string (bypass SRV) untuk DNS lokal yang blokir query SRV.
// Sama dengan +srv, cuma host di-expand manual.
const url = `mongodb://kenzamariyan:${password}@ac-bqtkd3r-shard-00-00.cjc8uee.mongodb.net:27017,ac-bqtkd3r-shard-00-01.cjc8uee.mongodb.net:27017,ac-bqtkd3r-shard-00-02.cjc8uee.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-23bcux-shard-0&authSource=admin&retryWrites=true&w=majority`

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
