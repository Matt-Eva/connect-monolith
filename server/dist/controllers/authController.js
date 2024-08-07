"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.login = void 0;
const neo4jConfig_js_1 = __importDefault(require("../config/neo4jConfig.js"));
const argon2_1 = __importDefault(require("argon2"));
const login = async (req, res) => {
    const { email, password } = req.body;
    const session = neo4jConfig_js_1.default.session();
    try {
        const query = "MATCH (user:User {email: $email}) RETURN user";
        const result = await session.executeRead(async (tx) => tx.run(query, { email: email }));
        if (result.records.length === 0)
            return res.status(404).send({ message: "user not found" });
        const user = result.records[0].get("user").properties;
        const authenticated = await argon2_1.default.verify(user.password, password);
        if (authenticated) {
            req.session.user = {
                name: user.name,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImg: user.profileImg,
                uId: user.uId,
            };
            res.status(200).send(req.session.user);
        }
        else {
            res.status(401).send({ error: "unauthorized" });
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ error: "internal server error" });
    }
    finally {
        await session.close();
    }
};
exports.login = login;
const logout = async (req, res) => {
    console.log("logging out");
    req.session.destroy((err) => {
        console.log("destroying session");
        if (err) {
            res.status(500).end();
        }
        else {
            res.status(204).end();
        }
    });
};
exports.logout = logout;
const me = (req, res) => {
    if (req.session.user) {
        res.status(200).send(req.session.user);
    }
    else {
        res.status(401).send({ error: "unauthorized" });
    }
};
exports.me = me;
