import Note from "./components/Notes"
import { useState, useEffect, useMemo } from 'react'
import Phonenumber from "./components/Phonenumber";
import axios from 'axios'
import debounce from 'lodash/debounce';
const baseUrl = 'http://localhost:3001/api/notes'

const SuccessMessage = (props) => {
  if (!props.value) {
    return null
  }
  return (
    <div className="success">
      <h2>Operation success</h2>
    </div>
  )
}

const ErrorMessage = (props) => {
  if (!props.value) {
    return null
  }
  return (
    <div className="error">
      <h2>Information of {props.value} has already been removed</h2>
    </div>
  )
}

const Course = (props) => {
  let exercises1 = 0;
  let exercises2 = 0;
  for (let part of props.course_info[0].parts) {
    exercises1 += part.exercises;
  }
  for (let part of props.course_info[1].parts) {
    exercises2 += part.exercises;
  }
  return ( 
  <div>
    <header>{props.course1.name}</header>
    <ul>
      {props.course1.parts.map(part => 
        <li key={part.id}>
          {part.name}: {part.exercises}
        </li>
      )}
    </ul>
    <h2>Total of: {props.exercises1}</h2>
    <header>{props.course2.name}</header>
    <ul>
      {props.course2.parts.map(part => 
        <li key={part.id}>
          {part.name}: {part.exercises}
        </li>
      )}
    </ul>
    <h2>Total of: {props.exercises2}</h2>
  </div>
)};

const NotesComponent = (props) => {
  const [notes, setNotes] = useState(null)
  const [showAll, setShowAll] = useState(true)
  const [newNote, setNewNote] = useState('a new note...')
  useEffect(() => {
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        setNotes(response.data)
      })
  }, [])
  if (!notes) { 
    return null 
  }
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
  
    axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      setNotes(notes.concat(response.data))
      setNewNote('')
    })
  }

  const handleNoteChange = (event) => {
    /*console.log(event.target.value) */
    setNewNote(event.target.value)
  }
  return(
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
      {notesToShow.map(note =>
          <Note key={note.id} note={note}/>,
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} 
        onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form> 
    </div>
  )
}

const PhonebookComponent = (props) => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [phonebook, setPhonebook] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPhonebook(response.data)
        setSuccess(true)
      })
  }, [])

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleFilter = (event) => {
    const filterValue = event.target.value;
    setFilterName(filterValue);
    setShowAll(filterValue === ''); // Reset showAll if filterValue is empty
    const filteredResults = phonebook.filter(
      (contact) => contact.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredList(filteredResults);
  };

  const addPhone = (event) => {
    event.preventDefault();
    if (phonebook.some((contact) => contact.phone === newPhone)) {
      alert(`${newPhone} already exists`);
    } else if (phonebook.some((contact) => contact.name === newName)) {
      if (window.confirm('Name already in the system, should we change the number')) {
        const contactToUpdate = phonebook.find((contact) => contact.name === newName)
        axios.patch(`http://localhost:3001/persons/${contactToUpdate.id}`, {phone:newPhone})
        .then(res => {
          let newList = phonebook.map(el => el.name===newName ? {...el, phone:newPhone} : el)
          setPhonebook(newList)
        })
      }
    } else {
      const phonebookObject = {
        name: newName,
        phone: newPhone,
      };
      axios.post('http://localhost:3001/persons', phonebookObject).then(res => {setPhonebook(phonebook.concat(phonebookObject));})
    }
    setNewName('');
    setNewPhone('');
  };

  const handleDelete = (event) => {
    axios.delete(`http://localhost:3001/persons/${event.target.value}`)
    .then(res => {setPhonebook(phonebook.filter( phone => phone.id !== event.target.value))})
    .catch(error => {setError(event.target.value)})
  }

  const namesToShow = showAll ? phonebook : filteredList;

  return (
    <div>
      <SuccessMessage value={success}/>
      <h2>Phonebook</h2>
      <form onSubmit={addPhone}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newPhone} onChange={handlePhoneChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {namesToShow.map((phonebookObject) => (
          <li key={phonebookObject.phone}>
            {phonebookObject.name}: {phonebookObject.phone}
            <button value={phonebookObject.id} onClick={handleDelete}>delete</button>
            <ErrorMessage value={error}/>
          </li>
        ))}
      </ul>
      <h3>Filter</h3>
      <input value={filterName} onChange={handleFilter} />
    </div>
  );
};


const CountryApiComponent = (props) => {
  const [apiFilter, setApiFilter] = useState('');
  const [countries, setCountries] = useState(null);
  const [qError, setQError] = useState(false);
  

  useEffect(() => { 
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(res => {
        const result = res.data;
        const filteredCountries = result.filter(el => el.name.common.toLowerCase().includes(apiFilter.toLowerCase()));
        
        if (filteredCountries.length > 10) {
          setQError(true);
          setCountries(null); // Clear countries if there's an error
        } else {
          let data = filteredCountries.map(country => ({
            name: country.name.official,
            area: country.area,
            capital: country.capital,
            languages: Object.values(country.languages).join(', '), // Convert object to array and join
          }));
          setQError(false);
          setCountries(data);
        }
      }) 
      .catch(error => {
        console.error('Error fetching data:', error);
        setQError(true);
        setCountries(null);
      });
  }, [apiFilter]);

  const handleFilter = (event) => {
    setApiFilter(event.target.value);
  }
  
  return (
    <div>
      <input onChange={handleFilter} value={apiFilter} placeholder="Search countries"/>
      <CountryDisplay countries={countries} error={qError}/>
    </div>
  );
}

const CountryDisplay = (props) => {
  if (props.error) {
    return <h2>Too many countries found or error occurred.</h2>;
  } else if (!props.countries || props.countries.length === 0) {
    return <h2>No countries found.</h2>;
  } else {
    return (
      <ul>
        {props.countries.map((el, index) => (
          <div key={index}> {/* Added key prop */}
            <li>{el.name}</li>
            <li>Area: {el.area}</li>
            <li>Capital: {el.capital}</li>
            <li>Languages: {el.languages}</li>
          </div>
        ))}
      </ul>
    );
  }
}

const App = (props) => {
  return (
    <div>
      <Course course1={props.course_info[0]} course2={props.course_info[1]} course_info = {props.course_info} />
      <NotesComponent />
      <PhonebookComponent />
      <CountryApiComponent />
    </div>
  );
};

export default App;
