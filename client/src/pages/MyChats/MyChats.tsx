import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import ChatCard from "../../components/ChatCard/ChatCard";

import styles from "./MyChats.module.css";

import { setChats } from "../../state/chats";

import { fetchChats } from "./UtilsMyChats";

function MyChats() {
  const chatsState = useSelector((state) => state.chats.value);
  const isFetched = chatsState.isFetched;
  const chats = chatsState.chats;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFetched) {
      fetchChats({ setChats, dispatch, setLoading });
    } else {
      setLoading(false);
    }
  }, [isFetched]);

  const displayChats = [];

  for (const key in chats) {
    const chat = {
      chatId: key,
      users: chats[key],
    };
    displayChats.push(<ChatCard key={key} {...chat} />);
  }

  return (
    <section className={styles.myChats}>
      {loading ? <h3>Loading...</h3> : <>{displayChats}</>}
    </section>
  );
}

export default MyChats;
