import { AstraDB } from "@datastax/astra-db-ts";

const astraClient = new AstraDB(
  process.env.CASSANDRA_TOKEN,
  "https://6e6d83d9-66c9-46f0-b043-3dda06cd3149-us-east1.apps.astra.datastax.com",
);

const verifyConnectivity = async () => {
  try {
    await astraClient.connect();
    console.log("astra connection successful");
  } catch (error) {
    console.error("astra connection error", error);
  }
};

verifyConnectivity();

export default astraClient;
