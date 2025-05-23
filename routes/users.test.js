const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");

describe("/auth", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const user0 = {
    username: "user0",
    email: "user0@mail.com",
    password: "123password",
  };
  const user1 = {
    username: "user1",
    email: "user1@mail.com",
    password: "456password",
  };

  describe("get user details", () => {
    describe("GET /details/:userId", () => {
      it("should return 200", async () => {
        const signup = await request(server).post("/auth/signup").send(user0);
        const user = jwt.decode(signup.body.token);
        const res = await request(server).get("/auth/details/" + user.userId).send();
        expect(res.statusCode).toEqual(200);
        expect(res.body.username).toEqual(user0.username);
      });
    });

    describe("should reject invalid userId", () => {
      it("should return 400", async () => {
        const res = await request(server).get("/auth/details/123").send();
        expect(res.statusCode).toEqual(400);
      });
    });

    describe("should reject bogus userId", () => {
      it("should return 404", async () => {
        const res = await request(server).get("/auth/details/507f1f77bcf86cd799439011").send();
        expect(res.statusCode).toEqual(404);
      });
    });
  });

  describe("before signup", () => {
    describe("POST /", () => {
      it("should return 401", async () => {
        const res = await request(server).post("/auth/login").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });

    describe("PUT /password", () => {
      it("should return 401", async () => {
        const res = await request(server).put("/auth/password").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });

    describe("PUT /username", () => {
      it("should return 401", async () => {
        const res = await request(server).put("/auth/username").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });

    describe("PUT /bio", () => {
      it("should return 401", async () => {
        const res = await request(server).put("/auth/bio").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });

    describe("POST /logout", () => {
      it("should return 404", async () => {
        const res = await request(server).post("/auth/logout").send();
        expect(res.statusCode).toEqual(404);
      });
    });
  });

  describe("signup ", () => {
    describe("POST /signup", () => {
      it("should return 400 without a password", async () => {
        const res = await request(server).post("/auth/signup").send({
          email: user0.email,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 400 with empty password", async () => {
        const res = await request(server).post("/auth/signup").send({
          email: user1.email,
          password: "",
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 200 and with a password", async () => {
        const res = await request(server).post("/auth/signup").send(user1);
        expect(res.statusCode).toEqual(200);
      });

      it("should return 409 Conflict with a repeat signup", async () => {
        let res = await request(server).post("/auth/signup").send(user0);
        expect(res.statusCode).toEqual(200);
        res = await request(server).post("/auth/signup").send(user0);
        expect(res.statusCode).toEqual(409);
      });

      it("should not store raw password", async () => {
        await request(server).post("/auth/signup").send(user0);
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user).includes(user0.password)).toBe(false);
        });
      });
    });
  });

  describe.each([user0, user1])("User %#", (user) => {
    beforeEach(async () => {
      await request(server).post("/auth/signup").send(user0);
      await request(server).post("/auth/signup").send(user1);
    });

    describe("POST /", () => {
      it("should return 400 when password isn't provided", async () => {
        const res = await request(server).post("/auth/login").send({
          email: user.email,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 401 when password doesn't match", async () => {
        const res = await request(server).post("/auth/login").send({
          email: user.email,
          password: "123",
        });
        expect(res.statusCode).toEqual(401);
      });

      it("should return 200 and a token when password matches", async () => {
        const res = await request(server).post("/auth/login").send(user);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body.token).toEqual("string");
      });

      it("should not store token on user", async () => {
        const res = await request(server).post("/auth/login").send(user);
        const token = res.body.token;
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user)).not.toContain(token);
        });
      });

      it("should return a JWT with user email, _id, and roles inside, but not password", async () => {
        const res = await request(server).post("/auth/login").send(user);
        const token = res.body.token;
        const decodedToken = jwt.decode(token);
        expect(decodedToken.email).toEqual(user.email);
        expect(decodedToken.roles).toEqual("user");
        expect(decodedToken._id).toMatch(
          /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,
        ); // mongo _id regex
        expect(decodedToken.password).toBeUndefined();
      });
    });
  });

  describe("After both users login", () => {
    let token0;
    let token1;

    beforeEach(async () => {
      await request(server).post("/auth/signup").send(user0);
      const res0 = await request(server).post("/auth/login").send(user0);
      token0 = res0.body.token;
      await request(server).post("/auth/signup").send(user1);
      const res1 = await request(server).post("/auth/login").send(user1);
      token1 = res1.body.token;
    });

    describe("PUT /password", () => {
      it("should reject bogus token", async () => {
        const res = await request(server)
          .put("/auth/password")
          .set("Authorization", "Bearer BAD")
          .send({ password: "123" });
        expect(res.statusCode).toEqual(401);
      });

      it("should reject bogus token", async () => {
        const res = await request(server)
          .put("/auth/username")
          .set("Authorization", "Bearer BAD")
          .send({ username: "123" });
        expect(res.statusCode).toEqual(401);
      });

      it("should reject bogus token", async () => {
        const res = await request(server)
          .put("/auth/bio")
          .set("Authorization", "Bearer BAD")
          .send({ bio: "123" });
        expect(res.statusCode).toEqual(401);
      });

      it("should reject empty password", async () => {
        const res = await request(server)
          .put("/auth/password")
          .set("Authorization", "Bearer " + token0)
          .send({ password: "" });
        expect(res.statusCode).toEqual(400);
      });

      it("should reject empty username", async () => {
        const res = await request(server)
          .put("/auth/username")
          .set("Authorization", "Bearer " + token0)
          .send({ username: "" });
        expect(res.statusCode).toEqual(400);
      });

      it("should reject empty bio", async () => {
        const res = await request(server)
          .put("/auth/bio")
          .set("Authorization", "Bearer " + token0)
          .send({ bio: "" });
        expect(res.statusCode).toEqual(400);
      });

      it("should change password for user0", async () => {
        const res = await request(server)
          .put("/auth/password")
          .set("Authorization", "Bearer " + token0)
          .send({ password: "123" });
        expect(res.statusCode).toEqual(200);
        let loginRes0 = await request(server).post("/auth/login").send(user0);
        expect(loginRes0.statusCode).toEqual(401);
        loginRes0 = await request(server).post("/auth/login").send({
          username: user0.username,
          email: user0.email,
          password: "123",
        });
        expect(loginRes0.statusCode).toEqual(200);
        const loginRes1 = await request(server).post("/auth/login").send(user1);
        expect(loginRes1.statusCode).toEqual(200);
      });
      
      it("should change password for user1", async () => {
        const res = await request(server)
          .put("/auth/password")
          .set("Authorization", "Bearer " + token1)
          .send({ password: "123" });
        expect(res.statusCode).toEqual(200);
        const loginRes0 = await request(server).post("/auth/login").send(user0);
        expect(loginRes0.statusCode).toEqual(200);
        let loginRes1 = await request(server).post("/auth/login").send(user1);
        expect(loginRes1.statusCode).toEqual(401);
        loginRes1 = await request(server).post("/auth/login").send({
          username: user1.username,
          email: user1.email,
          password: "123",
        });
        expect(loginRes1.statusCode).toEqual(200);
      });

      it("should change username for user0", async () => {
        const res = await request(server)
          .put("/auth/username")
          .set("Authorization", "Bearer " + token0)
          .send({ username: "123" });
        expect(res.statusCode).toEqual(200);
        const newUser = await User.findOne({email: user0.email}).lean();
        expect(newUser.username).toEqual("123");
      });

      it("should change bio for user0", async () => {
        const res = await request(server)
          .put("/auth/bio")
          .set("Authorization", "Bearer " + token0)
          .send({ bio: "123" });
        expect(res.statusCode).toEqual(200);
        const newUser = await User.findOne({email: user0.email}).lean();
        expect(newUser.bio).toEqual("123");
      });

    });
  });
});
