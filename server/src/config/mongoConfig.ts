import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_TOKEN;

let mongoClient: MongoClient | undefined;

if (uri) {
  mongoClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

const verifyConnectivity = async (mongoClient: MongoClient | undefined) => {
  if (mongoClient) {
    try {
      await mongoClient.connect();
      await mongoClient.db("admin").command({ ping: 1 });
      console.log("connected to mongodb");
    } catch (error) {
      console.error(error);
    } finally {
      await mongoClient.close();
    }
  } else {
    console.log("mongoClient undefined");
  }
};

verifyConnectivity(mongoClient);

export default mongoClient;
