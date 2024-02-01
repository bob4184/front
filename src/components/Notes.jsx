import axios from 'axios'


const Note = ({ note }) => {
  const changedNote = { important: !note.important }
  const handleCheck = () => {
    axios
    .patch(`http://localhost:3001/notes/${note.id}`, changedNote)
    
  }
  return (
    <div>
      <li>{note.content}</li>
      <input type="checkbox" defaultChecked={note.important} onChange={handleCheck}/>
    </div>
  )
}
  
export default Note