const search = async ({ setSearchResults, searchInput, setSearchLoading }) => {
  try {
    const res = await fetch(`/api/search-connections/${searchInput}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setSearchResults(data);
      setSearchLoading(false);
    } else {
      const error = await res.json();
      console.error(error);
    }
  } catch (e) {
    console.error(e);
  }
};

export { search };
