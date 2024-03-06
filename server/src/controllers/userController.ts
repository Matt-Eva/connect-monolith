import argon2 from "argon2";
import neoDriver from "../config/neo4jConfig.js";
import { Request, Response } from "express";
import { v4 } from "uuid";
const uuid = v4;

// loads user for profile page
exports.getUser = async (req: Request, res: Response) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const selfId = req.session.user.uId;
  const userId = req.params.id;
  const session = neoDriver.session();
  try {
    const query = `
              MATCH (s:User {uId: $selfId}), (u:User {uId: $userId}) 
              WHERE NOT (s) <- [:BLOCKED] - (u)
              WITH u, s
              OPTIONAL MATCH (u) - [:POSTED] -> (p:Post)
              RETURN u.profileImg AS profileImg, u.name AS name, exists((s) - [:CONNECTED] - (u)) AS connected, exists((s) - [:INVITED] -> (u)) AS pending, exists((s) <- [:INVITED] - (u)) AS invited, exists((s) - [:BLOCKED] -> (u)) AS blocked, exists((s) - [:IGNORED] -> (u)) AS ignored, p AS post`;

    const result = await session.executeRead((tx) =>
      tx.run(query, { userId: userId, selfId: selfId }),
    );

    console.log(result.records);

    if (result.records.length !== 0) {
      const user = {
        profileImg: result.records[0].get("profileImg"),
        name: result.records[0].get("name"),
        connected: result.records[0].get("connected"),
        invited: result.records[0].get("invited"),
        pending: result.records[0].get("pending"),
        blocked: result.records[0].get("blocked"),
        ignored: result.records[0].get("ignored"),
        uId: userId,
      };

      const posts = result.records.map((record) => {
        return record.get("post").properties;
      });

      res.status(200).send({ user, posts });
    } else {
      res.status(404).send({ message: "user not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
};

exports.createUser = async (req: Request, res: Response) => {
  const session = neoDriver.session();

  try {
    const password = await argon2.hash(req.body.password);
    const user = await session.executeWrite(async (tx) => {
      const existingUser = await tx.run(
        `
                  MATCH (u:User {email: $email}) RETURN u
              `,
        { email: req.body.email },
      );

      if (existingUser.records.length !== 0) {
        return "already exists";
      }

      const newUser = await tx.run(
        `
              CREATE (u:User {email: $email, password: $password, name: $name, firstName: $firstName, lastName: $lastName, profileImg: $profileImg, uId: $uId})
              RETURN u.email AS email, u.name AS name, u.firstName AS firstName, u.lastName AS lastName, u.profileImg AS profileImg, u.uId AS uId
              `,
        {
          email: req.body.email,
          password: password,
          name: req.body.name,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          profileImg: req.body.profileImg,
          uId: uuid(),
        },
      );

      const newUserRecord = newUser.records[0];

      return {
        email: newUserRecord.get("email"),
        name: newUserRecord.get("name"),
        firstName: newUserRecord.get("firstName"),
        lastName: newUserRecord.get("lastName"),
        profileImg: newUserRecord.get("profileImg"),
        uId: newUserRecord.get("uId"),
      };
    });
    if (user === "already exists") {
      res.status(422).send({ error: "email already in use" });
    } else {
      req.session.user = user;
      res.status(201).send(user);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "internal server error" });
  } finally {
    await session.close();
  }
};

exports.updateUser = async (req: Request, res: Response) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const selfId = req.session.user.uId;
  const newInfo = req.body.newInfo;
  const session = neoDriver.session();

  try {
    const query = `
              MATCH (u:User {uId: $selfId})
              SET u.firstName = $firstName, u.lastName = $lastName, u.email = $email
              RETURN u.firstName AS firstName, u.lastName AS lastName, u.email AS email
          `;

    const result = await session.executeWrite((tx) =>
      tx.run(query, { ...newInfo, selfId }),
    );

    if (result.records.length !== 0) {
      const updatedInfo = {
        firstName: result.records[0].get("firstName"),
        lastName: result.records[0].get("lastName"),
        email: result.records[0].get("email"),
      };

      res.status(202).send(updatedInfo);
    } else {
      res.status(422).end();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
};

exports.updatePassword = async (req: Request, res: Response) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const selfId = req.session.user.uId;
  const passwordInfo = req.body.passwordInfo;
  const session = neoDriver.session();

  try {
    const findQuery = `
              MATCH (u:User {uId: $selfId})
              RETURN u.password AS password
          `;
    const user = await session.executeRead((tx) =>
      tx.run(findQuery, { selfId }),
    );

    if (user.records.length === 0)
      return res.status(404).send({ message: "user not found" });

    const passwordHash = user.records[0].get("password");

    const authorized = await argon2.verify(
      passwordHash,
      passwordInfo.currentPassword,
    );

    if (!authorized)
      return res.status(401).send({
        message:
          "Password entered for current password does not match current password.",
      });

    const newPasswordHash = await argon2.hash(passwordInfo.newPassword);

    const updateQuery = `
              MATCH (u:User {uId: $selfId})
              SET u.password = $newPassword
          `;

    await session.executeWrite((tx) =>
      tx.run(updateQuery, { newPassword: newPasswordHash, selfId }),
    );

    res.status(202).end();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
};

exports.deleteUser = async (req: Request, res: Response) => {
  if (!req.session.user) return res.status(401).send({ error: "unauthorized" });

  const selfId = req.session.user.uId;
  const session = neoDriver.session();
  try {
    const query = `
              MATCH (u:User {uId: $selfId})
              OPTIONAL MATCH (u) - [:SENT] -> (m:Message)
              DETACH DELETE u, m
          `;

    await session.executeWrite((tx) => tx.run(query, { selfId }));

    res.status(202).end();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "internal server error" });
  } finally {
    await session.close();
  }
};
