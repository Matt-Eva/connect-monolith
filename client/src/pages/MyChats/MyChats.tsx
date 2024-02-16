import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../reduxHooks";

import ChatCard from "../../components/ChatCard/ChatCard";

import styles from "./MyChats.module.css";

import { setChats } from "../../state/chats";

import { fetchChats } from "./UtilsMyChats";

function MyChats() {
  const chatsState = useAppSelector((state) => state.chats.value);
  const isFetched = chatsState.isFetched;

  const chats = chatsState.chats;
  const dispatch = useAppDispatch();

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
      users: chats[key].users,
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
