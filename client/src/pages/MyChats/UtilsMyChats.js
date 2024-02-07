const fetchChats = async ({ setChats, setLoading }) => {
  const res = await fetch("/api/my-chats", {
    credentials: "include",
  });

  if (res.ok) {
    const chats = await res.json();
    setChats(chats);
    setLoading(false);
  } else {
    alert("Something went wrong when loading your chats.");
  }
};

export { fetchChats };
