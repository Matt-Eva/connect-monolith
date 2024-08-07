"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsers = void 0;
const seedConfig_js_1 = require("../seedConfig.js");
const faker_1 = require("@faker-js/faker");
const argon2_1 = __importDefault(require("argon2"));
const createUsersWithConnections = async (session, user1, user2) => {
    try {
        // const createConnected = `
        //   MERGE (u1:User {uId: $u1Id, name: $u1Name})
        //   MERGE (u2:User {uId: $u2Id, name: $u2Name})
        //   MERGE (u1) - [c:CONNECTED] - (u2)
        //   RETURN u1, u2, c
        // `
        const user1Password = await argon2_1.default.hash(user1.password);
        const user2Password = await argon2_1.default.hash(user2.password);
        const result = await session.executeWrite(async (tx) => {
            let newUser1 = await tx.run(`
        MATCH (u:User {email: $email}) RETURN u
      `, { email: user1.email });
            if (newUser1.records.length === 0) {
                newUser1 = await tx.run(`
          CREATE(u:User {uId: $uId, email: $email, name: $name, firstName: $firstName, lastName: $lastName, password: $password}) RETURN u
        `, { ...user1, ["password"]: user1Password });
            }
            let newUser2 = await tx.run(`
        MATCH (u:User {email: $email}) RETURN u
      `, { email: user2.email });
            if (newUser2.records.length === 0) {
                newUser2 = await tx.run(`
          CREATE(u:User {uId: $uId, email: $email, name: $name, firstName: $firstName, lastName: $lastName, password: $password}) RETURN u
        `, { ...user2, ["password"]: user2Password });
            }
            const newConnection = await tx.run(`
        MATCH (u:User {uId: $user1Id}), (c:User {uId: $user2Id})
        MERGE (u) - [:CONNECTED] - (c)
        RETURN u, c
      `, { user1Id: user1.uId, user2Id: user2.uId });
            return newConnection;
        });
    }
    catch (e) {
        console.error(e);
    }
};
const createUserArray = () => {
    const users = [
        {
            uId: (0, seedConfig_js_1.uuid)(),
            firstName: "Matt",
            lastName: "French",
            name: "Matt French",
            email: "matt@email.com",
            password: "test",
        },
        {
            uId: (0, seedConfig_js_1.uuid)(),
            firstName: "Wills",
            lastName: "Wolfen",
            name: "Wills Woflen",
            email: "wills@email.com",
            password: "test",
        },
        {
            uId: (0, seedConfig_js_1.uuid)(),
            firstName: "Jay",
            lastName: "Jubilee",
            name: "Jay Jubilee",
            email: "jay@email.com",
            password: "test",
        },
        {
            uId: (0, seedConfig_js_1.uuid)(),
            firstName: "Jay",
            lastName: "Heebles",
            name: "Jay Heebles",
            email: "jay1@email.com",
            password: "test",
        },
        {
            uId: (0, seedConfig_js_1.uuid)(),
            firstName: "Tom",
            lastName: "Titanium",
            name: "Tom Titanium",
            email: "tom@email.com",
            password: "test",
        },
        {
            uId: (0, seedConfig_js_1.uuid)(),
            name: "Nick Nonifont",
            firstName: "Nick",
            lastName: "Nonifont",
            email: "nick@email.com",
            password: "test",
        },
        {
            uId: (0, seedConfig_js_1.uuid)(),
            name: "Jay Jangles",
            firstName: "Jay",
            lastName: "Jangles",
            email: "jay2@email.com",
            password: "test",
        },
        {
            uId: (0, seedConfig_js_1.uuid)(),
            name: "Mustafa Forthworth",
            firstName: "Mustafa",
            lastName: "Forthworth",
            email: "mustafa@email.com",
            password: "test",
        },
        {
            uId: (0, seedConfig_js_1.uuid)(),
            name: "Jim James",
            firstName: "Jim",
            lastName: "James",
            email: "jim@email.com",
            password: "test",
        },
        {
            uId: (0, seedConfig_js_1.uuid)(),
            name: "Liz Johnson",
            firstName: "Liz",
            lastName: "Johnson",
            email: "liz@email.com",
            password: "test",
        },
        {
            uId: (0, seedConfig_js_1.uuid)(),
            name: "Laura Smalls",
            firstName: "Laura",
            lastName: "Smalls",
            email: "laura@email.com",
            password: "test",
        },
        {
            uId: (0, seedConfig_js_1.uuid)(),
            name: "Sam Singleton",
            firstName: "Sam",
            lastName: "Singleton",
            email: "sam@email.com",
            password: "test",
        },
    ];
    for (let i = 0; i < 20; i++) {
        const firstName = faker_1.faker.person.firstName();
        const lastName = faker_1.faker.person.lastName();
        const user = {
            uId: (0, seedConfig_js_1.uuid)(),
            name: `${firstName} ${lastName}`,
            firstName: firstName,
            lastName: lastName,
            password: faker_1.faker.word.sample(),
            email: faker_1.faker.internet.email(),
        };
        users.push(user);
    }
    return users;
};
const createUsers = async (driver) => {
    const session = driver.session();
    const users = createUserArray();
    const relTracker = {};
    for (let i = 0; i < users.length; i++) {
        if (!relTracker[i])
            relTracker[i] = [];
        for (let n = 1; n <= 4; n++) {
            if (relTracker[i].length === 5)
                break;
            const a = i + n;
            const b = a >= users.length ? a - users.length : a;
            if (!relTracker[b])
                relTracker[b] = [];
            if (relTracker[b].length === 5)
                break;
            relTracker[i].push(b);
            relTracker[b].push(i);
            const user1 = users[i];
            const user2 = users[b];
            // console.log(i, b)
            await createUsersWithConnections(session, user1, user2);
        }
    }
    await session.close();
    return users;
};
exports.createUsers = createUsers;
