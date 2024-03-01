import { Request, Response } from "express";
import mongoClient from "../config/mongoConfig";

exports.newPost = async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
  res.status(200).send(body);
};
