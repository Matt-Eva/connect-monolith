

function CreateChatUserCard({user, addParticipant}) {
    
  return (
    <div>
        {user.name}
        <button onClick={() => addParticipant(user)}>Add</button>
    </div>
  )
}

export default CreateChatUserCard