import {useState} from "react"
import NewConnectionCard from "../../components/NewConnectionCard/NewConnectionCard"

function NewConnections() {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async (e) =>{
    e.preventDefault()
  
    try{
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/search-connections/${search}`, {
        credentials: "include"
      })
      if (res.ok){
        const data = await res.json()
        setSearchResults(data)
      } else{
        const error = await res.json()
        console.error(error)
      }
    } catch (e){
      console.error(e)
    }
  }

  const displayResults = searchResults.map(result => <NewConnectionCard key={result.uId} {...result}/>)

  console.log(displayResults)
  return (
    <div>NewConnections

    <form onSubmit={handleSearch}>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
      <input type="submit" value="search" />
    </form>
      {displayResults}
    </div>
  )
}

export default NewConnections