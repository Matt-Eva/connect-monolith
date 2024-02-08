const fetchConnections = async ({ setConnections, setLoading, dispatch }) => {
  const res = await fetch("/api/my-connections", {
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(setConnections(data));
    setLoading(false);
  } else if (res.status === 401) {
    console.log("unauthorized");
  }
};

const createChat = async ({ participants, navigate, addChat, dispatch }) => {
  const body = {
    participants,
  };

  const res = await fetch("/api/new-chat", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    const newChat = await res.json();
    dispatch(addChat({ chatId: newChat.uId, participants }));
    navigate(`/chat/${newChat.uId}`);
  }
};

const filterConnections = ({ connections, participants, search }) => {
  return connections.filter((connection) => {
    const searchMatch = connection.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const isParticipant = participants.find(
      (participant) => participant.uId === connection.uId
    );
    if (searchMatch && !isParticipant) {
      return true;
    } else {
      return false;
    }
  });
};

export { fetchConnections, createChat, filterConnections };