import { Request, Response } from "express";
import mongoClient from "../config/mongoConfig";
import neoDriver from "../config/neo4jConfig";
import { v4 } from "uuid";
const uuid = v4;

exports.savePostDraft = async (req: Request, res: Response) => {
  try {
    const collection = mongoClient.db("connect").collection("posts");
    const result = await collection.insertOne(req.body);
    console.log(result.insertedId.toString());
    res.status(200).send(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error });
  }
};

exports.publishPost = async (req: Request, res: Response) => {
  try {
    const collection = mongoClient.db("connect").collection("posts");
    const mongoResult = await collection.insertOne(req.body);
    if (mongoResult.acknowledged) {
      const session = neoDriver.session();
      try {
        const userId = req.session.user!.uId;
        const neoPost = {
          uId: uuid(),
          mongoId: mongoResult.insertedId.toString(),
          mainPostContent: req.body.main_post_content,
          mainPostLinksText: req.body.main_post_links_text,
          mainPostLinksLinks: req.body.main_post_links_links,
        };
        const query = `
            MATCH (u:User {uId: $userId})
            CREATE (u) - [:POSTED] -> (p:Post $props)
            RETURN p AS post, u.name AS username
        `;
        const neoResult = await session.executeWrite((tx) =>
          tx.run(query, { userId, props: neoPost }),
        );
        console.log(
          neoResult.records[0].get("username"),
          neoResult.records[0].get("post"),
        );

        res.status(200).send(req.body);
      } catch (error) {
        console.error(error);
        throw new Error("could not insert post node to neo4j");
      }
    } else {
      throw new Error("could not insert post document to mongodb");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error });
  }
};

exports.getPosts = async (req: Request, res: Response) => {
  const userId = req.session.user?.uId;
  const session = neoDriver.session();
  try {
    if (userId) {
      const query = `
      MATCH (u:User {uId: $userId}) - [:CONNECTED] - (c:User) - [:POSTED] -> (p:Post)
      RETURN p AS post, c.name AS username, c.uId AS userId
      LIMIT 100 
    `;

      const result = await session.executeRead((tx) =>
        tx.run(query, { userId }),
      );

      const posts = [];
      for (const record of result.records) {
        posts.push({
          post: record.get("post").properties,
          username: record.get("username"),
          userId: record.get("userId"),
        });
      }

      res.status(200).send(posts);
    } else {
      throw new Error("userId is undefined");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};
