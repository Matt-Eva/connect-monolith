import {useState} from "react"
import NewConnectionCard from "../../components/NewConnectionCard/NewConnectionCard"
import styles from "./Search.module.css"

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
      <form onSubmit={handleSearch} className={styles.form}>
        <input type="text" value={search} placeholder="Find new connections..." onChange={(e) => setSearch(e.target.value)} className={styles.searchField}/>
        <input type="submit" value="search" className={styles.searchButton}/>
      </form>
      <div className={styles.resultsContainer}>
        {displayResults}
      </div>
    </div>
  )
}

export default NewConnections