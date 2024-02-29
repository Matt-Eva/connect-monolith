import { Request, Response } from "express";

exports.newPost = async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
  res.status(200).send(body);
};
