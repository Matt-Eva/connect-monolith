"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoConfig_1 = __importDefault(require("../config/mongoConfig"));
const neo4jConfig_1 = __importDefault(require("../config/neo4jConfig"));
const uuid_1 = require("uuid");
const uuid = uuid_1.v4;
// exports.saveNewPostDraft = async (req: Request, res: Response) => {
//   try {
//     const collection = mongoClient.db("connect").collection("posts");
//     const result = await collection.insertOne(req.body);
//     if (result.acknowledged) {
//       const mongoId = result.insertedId.toString();
//       res.status(200).send({ mongoId });
//     } else {
//       throw new Error("could not save draft");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error });
//   }
// };
// exports.saveExistingPostDraft = async (req: Request, res: Response) => {
//   try {
//     const postCollection = mongoClient.db("connect").collection("posts");
//     const mongoId = new ObjectId(req.params.mongoId);
//     const updateDoc = {
//       $set: req.body,
//     };
//     const result = await postCollection.updateOne({ _id: mongoId }, updateDoc);
//     if (result.acknowledged) {
//       res.status(201).send({ updated: true });
//     } else {
//       throw new Error("could not save document");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: error });
//   }
// };
exports.publishPost = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ error: "unauthorized" });
    const post = req.body;
    try {
        const collection = mongoConfig_1.default.db("connect").collection("posts");
        const result = await collection.insertOne(post);
        if (result.acknowledged) {
            const mongoId = result.insertedId.toString();
            const session = neo4jConfig_1.default.session();
            try {
                const userId = req.session.user.uId;
                const isSecondaryContent = post.secondary_content.length !== 0 ? true : false;
                const neoId = uuid();
                const neoPost = {
                    uId: neoId,
                    mongoId: mongoId,
                    mainPostContent: post.main_post_content,
                    mainPostLinksText: post.main_post_links_text,
                    mainPostLinksLinks: post.main_post_links_links,
                    createdAt: post.created_at,
                    isSecondaryContent,
                };
                const query = `
            MATCH (u:User {uId: $userId})
            CREATE (u) - [:POSTED] -> (p:Post $props)
            RETURN p AS post, u.name AS username
            
        `;
                await session.executeWrite((tx) => tx.run(query, { userId, props: neoPost }));
                const responsePost = {
                    post: {
                        ...neoPost,
                        secondaryContent: post.secondary_content,
                        secondaryContentFetched: true,
                    },
                    username: req.session.user.name,
                    userId: userId,
                };
                res.status(200).send(responsePost);
            }
            catch (error) {
                console.error(error);
                throw new Error("could not insert post node to neo4j");
            }
            finally {
                await session.close();
            }
        }
        else {
            throw new Error("could not save draft");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: error });
    }
};
exports.getPosts = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ error: "unauthorized" });
    const userId = req.session.user.uId;
    const session = neo4jConfig_1.default.session();
    try {
        const query = `
      MATCH (u:User {uId: $userId}) - [:CONNECTED] - (c:User) - [:POSTED] -> (p:Post)
      RETURN p AS post, c.name AS username, c.uId AS userId
      ORDER BY p.createdAt DESC
      LIMIT 100 
    `;
        const result = await session.executeRead((tx) => tx.run(query, { userId }));
        const posts = result.records.map((record) => {
            return {
                post: {
                    ...record.get("post").properties,
                    secondaryContentFetched: false,
                    secondaryContent: [],
                },
                username: record.get("username"),
                userId: record.get("userId"),
            };
        });
        res.status(200).send(posts);
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await session.close();
    }
};
exports.getSecondaryPostContent = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ error: "unauthorized" });
    try {
        const mongoId = req.params.mongoId;
        const collection = mongoConfig_1.default.db("connect").collection("posts");
        const postId = new mongodb_1.ObjectId(mongoId);
        const mongoPost = await collection.findOne({ _id: postId });
        if (mongoPost) {
            const secondaryContent = mongoPost.secondary_content;
            res.status(200).send(secondaryContent);
        }
        else {
            res.status(404).send({ message: "could not find post" });
        }
    }
    catch (error) {
        console.error(error);
    }
};
exports.getMyPosts = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ error: "unauthorized" });
    const userId = req.session.user.uId;
    try {
        console.log(userId);
        const postsCollection = mongoConfig_1.default.db("connect").collection("posts");
        const myPosts = await postsCollection
            .find({ user_id: userId })
            .sort({ created_at: -1 })
            .toArray();
        console.log(myPosts);
        res.status(200).send(myPosts);
    }
    catch (error) {
        console.error(error);
    }
};
exports.deletePost = async (req, res) => {
    if (!req.session.user)
        return res.status(401).send({ error: "unauthorized" });
    const mongoId = req.params.mongoId;
    const session = neo4jConfig_1.default.session();
    try {
        const neoQuery = `
    MATCH (p:Post {mongoId: $mongoId})
    DETACH DELETE p
    `;
        const neoResult = session.executeWrite((tx) => tx.run(neoQuery, { mongoId }));
        const collection = mongoConfig_1.default.db("connect").collection("posts");
        const postId = new mongodb_1.ObjectId(mongoId);
        const mongoResult = collection.deleteOne({ _id: postId });
        await Promise.all([neoResult, mongoResult]);
        res.status(201).end();
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await session.close();
    }
};
