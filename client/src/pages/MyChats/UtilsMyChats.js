const fetchChats = async ({ setChats, setLoading, dispatch }) => {
  const res = await fetch("/api/my-chats", {
    credentials: "include",
  });

  if (res.ok) {
    const chats = await res.json();
    dispatch(setChats(chats));
    setLoading(false);
  } else {
    alert("Something went wrong when loading your chats.");
  }
};

export { fetchChats };
