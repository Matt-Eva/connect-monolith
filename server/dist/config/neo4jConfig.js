"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const neoDriver = neo4j_driver_1.default.driver(process.env.NEO_URL, neo4j_driver_1.default.auth.basic(process.env.NEO_USER, process.env.NEO_PASSWORD));
const testDriverConnectivity = async (neoDriver) => {
    try {
        await neoDriver.verifyConnectivity();
        console.log("connected");
    }
    catch (error) {
        console.error(error);
        process.exit(0);
    }
};
testDriverConnectivity(neoDriver);
exports.default = neoDriver;
