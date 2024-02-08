import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ChatCard from "../../components/ChatCard/ChatCard";

import styles from "./MyChats.module.css";

import { fetchChats } from "./UtilsMyChats";

function MyChats() {
  const user = useSelector((state) => state.user.value);

  const [chats, setChats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChats({ setChats, setLoading });
    }
  }, []);

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
