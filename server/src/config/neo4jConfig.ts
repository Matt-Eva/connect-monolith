import neo, { Driver } from "neo4j-driver";

const neoDriver = neo.driver(
  process.env.NEO_URL!,
  neo.auth.basic(process.env.NEO_USER!, process.env.NEO_PASSWORD!),
);

const testDriverConnectivity = async (neoDriver: Driver) => {
  try {
    await neoDriver.verifyConnectivity();
    console.log("connected");
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
};

testDriverConnectivity(neoDriver);

export default neoDriver;
