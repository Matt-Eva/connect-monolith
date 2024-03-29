// this file is for testing the dynamic creation of a chat based on the number of users input
import { uuid } from "./seedConfig.js";
import { Driver } from "neo4j-driver";
import { User } from "./node-seeds/userSeeds.js";

const createMultiples = async (driver: Driver, users: User[]) => {
  const session = await driver.session();
  try {
    const chat = { id: uuid() };
    const query = `
            CREATE (c:Chat {id: $chatId})
            WITH c
            UNWIND $users AS user
            MATCH (u:User {id: user.id})
            CREATE (u) - [p:PARTICIPATING] -> (c)
            RETURN c AS chat, p AS participating
        `;
    const result = await session.executeWrite(async (tx) => {
      return await tx.run(query, { chatId: chat.id, users: users });
    });
    for (const record of result.records) {
      console.log([record.get("chat"), record.get("participating")]);
    }
  } catch (e) {
    console.error(e);
  }
  await session.close();
};

module.exports = {
  createMultiples,
};
