import cassandra from "cassandra-driver";
import { create } from "domain";

const cassDriver = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_ENDPOINT!],
  localDataCenter: "datacenter1",
  keyspace: "default_keyspace",
});

const createMessageTable = async () => {
  const createMessageTableQuery = `
        CREATE TABLE IF NOT EXISTS connect_messages (
            content text
            chat_id text
            time_created int
            user_id text
            user_profile_url text
            user_name_url text
            PRIMARY KEY(chat_id, time_created)
        ) WITH CLUSTERING ORDER BY (time_created DESC)
    `;

  const result = await cassDriver.execute(createMessageTableQuery);
  console.log(result);
};

createMessageTable();

export default cassDriver;
