import {useState} from "react"
import NewConnectionCard from "../../components/NewConnectionCard/NewConnectionCard"
import styles from "./NewConnections.module.css"

function NewConnections() {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async (e) =>{
    e.preventDefault()
  
    try{
      const res = await fetch(`/api/search-connections/${search}`, {
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

  console.log(searchResults)

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Search</h2>

    <form onSubmit={handleSearch} className={styles.form}>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className={styles.searchField}/>
      <input type="submit" value="search" className={styles.searchResults}/>
    </form>
      <div className={styles.resultsContainer}>
        {displayResults}
      </div>
      
    </div>
  )
}

export default NewConnections