const neo = require("neo4j-driver");

const driver = neo.driver(
  process.env.NEO_URL,
  neo.auth.basic(process.env.NEO_USER, process.env.NEO_PASSWORD),
);

const testDriverConnectivity = async (driver) => {
  try {
    await driver.verifyConnectivity();
    console.log("connected");
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
};

testDriverConnectivity(driver);

module.exports = driver;
