import { Request, Response } from "express";
import mongoClient from "../config/mongoConfig";

exports.newPost = async (req: Request, res: Response) => {
  try {
    await mongoClient?.connect();
    await mongoClient?.db("admin").command({ ping: 1 });
    console.log("connected to mongodb");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoClient?.close();
  }
  const body = req.body;
  console.log(body);
  res.status(200).send(body);
};
