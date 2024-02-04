import axios from 'axios'


const Note = ({ note }) => {
  const handleCheck = () => {
    axios
    .patch(`/api/notes/${note._id}`)
  }
  return (
    <div>
      <li>{note.content}</li>
      <input type="checkbox" defaultChecked={note.important} onChange={handleCheck}/>
    </div>
  )
}
  
export default Note