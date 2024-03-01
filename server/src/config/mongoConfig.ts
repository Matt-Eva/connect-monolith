import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_TOKEN;

const mongoClient = new MongoClient(uri!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const verifyConnectivity = async (mongoClient: MongoClient) => {
  try {
    await mongoClient.connect();
    console.log("connected to mongodb");
  } catch (error) {
    console.error(error);
  }
};

verifyConnectivity(mongoClient);

export default mongoClient;
