const neoDriver = require("../config/neo4jConfig.js");
const argon2 = require("argon2");
const { v4 } = require("uuid");
const uuid = v4;

exports.createUser = async (req, res) => {
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

exports.updateUser = async (req, res) => {
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
