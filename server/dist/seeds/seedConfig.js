"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDriver = exports.uuid = exports.driver = void 0;
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const uuid_1 = require("uuid");
const uuid = uuid_1.v4;
exports.uuid = uuid;
const { NEO_URL, NEO_USER, NEO_PASSWORD } = process.env;
const driver = neo4j_driver_1.default.driver(NEO_URL, neo4j_driver_1.default.auth.basic(NEO_USER, NEO_PASSWORD));
exports.driver = driver;
const closeDriver = async () => {
    await driver.close();
};
exports.closeDriver = closeDriver;
