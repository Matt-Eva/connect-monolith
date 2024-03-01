import { Request, Response } from "express";
import mongoClient from "../config/mongoConfig";

exports.savePostDraft = async (req: Request, res: Response) => {
  try {
    const collection = mongoClient.db("connect").collection("posts");
    const result = await collection.insertOne(req.body);
    console.log(result);
    res.status(200).send({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error });
  } finally {
    await mongoClient?.close();
  }
};
