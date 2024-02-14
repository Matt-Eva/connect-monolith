import { driver, closeDriver } from "./seedConfig";
import { createUsers } from "./node-seeds/userSeeds";
// import { createMultiples } from "./testCreateMultiple";
import { createChats } from "./node-seeds/chatSeeds";

const clearDatabase = async () => {
  console.log("clearing");
  try {
    const session = driver.session();
    await session.executeWrite(async (tx) => {
      await tx.run("MATCH (n) DETACH DELETE n ");
    });
    console.log("cleared");
  } catch (e) {
    console.error(e);
  }
};

const seed = async () => {
  await clearDatabase();
  console.log("seeding");
  const users = await createUsers(driver);
  console.log("seeded users");
  console.log("seeding chats");
  await createChats(driver, users);
  console.log("chats seeded");
  console.log("seeding done");
  await closeDriver();
};

seed();
