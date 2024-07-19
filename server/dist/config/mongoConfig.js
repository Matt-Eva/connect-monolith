"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const uri = process.env.MONGO_TOKEN;
const mongoClient = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
const verifyConnectivity = async (mongoClient) => {
    try {
        await mongoClient.connect();
        console.log("connected to mongodb");
    }
    catch (error) {
        console.error(error);
    }
};
verifyConnectivity(mongoClient);
exports.default = mongoClient;
