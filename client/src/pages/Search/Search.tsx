import { useState } from "react";

import NewConnectionCard from "../../components/NewConnectionCard/NewConnectionCard";

import { SearchResult } from "../../types/userSearch";

import styles from "./Search.module.css";

import { search } from "./UtilsSearch";

function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  type SearchResults = SearchResult[];
  const [searchResults, setSearchResults] = useState<SearchResults>([]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchLoading(true);
    search({ setSearchResults, searchInput, setSearchLoading });
  };

  const displayResults = searchResults.map((result) => (
    <NewConnectionCard key={result.uId} {...result} />
  ));

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="text"
          value={searchInput}
          placeholder="Find new connections..."
          onChange={(e) => setSearchInput(e.target.value)}
          className={styles.searchField}
        />
        <input type="submit" value="search" className={styles.searchButton} />
      </form>
      <div className={styles.resultsContainer}>
        {searchLoading ? <h2>Searching...</h2> : displayResults}
      </div>
    </div>
  );
}

export default Search;
