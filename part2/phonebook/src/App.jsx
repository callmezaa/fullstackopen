import { useEffect, useState } from "react";
import personService from "./services/persons";

const Filter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      filter shown with <input value={searchTerm} onChange={handleSearchChange} />
    </div>
  );
};

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>

      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number} <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
        </p>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    if (existingPerson) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`);

      if (!confirmUpdate) {
        return;
      }

      personService.update(existingPerson.id, newPerson).then((response) => {
        setPersons(persons.map((person) => (person.id === existingPerson.id ? response.data : person)));

        setNewName("");
        setNewNumber("");
      });

      return;
    }

    personService.create(newPerson).then((response) => {
      setPersons(persons.concat(response.data));
      setNewName("");
      setNewNumber("");
    });
  };

  const deletePerson = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);

    if (!confirmDelete) {
      return;
    }

    personService.remove(id).then(() => {
      setPersons(persons.filter((person) => person.id !== id));
    });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const personsToShow = persons.filter((person) => person.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
