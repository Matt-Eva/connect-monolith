import dotenv from "dotenv";
import neo from "neo4j-driver";
import { v4 } from "uuid";
const uuid = v4;

dotenv.config();

const { NEO_URL, NEO_USER, NEO_PASSWORD } = process.env;

const driver = neo.driver(NEO_URL!, neo.auth.basic(NEO_USER!, NEO_PASSWORD!));

const closeDriver = async () => {
  await driver.close();
};

export { driver, uuid, closeDriver };
