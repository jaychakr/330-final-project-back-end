const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");
const mongoose = require("mongoose");

const Conversation = require("../models/conversation");

describe("/conversations", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const conversation0 = { username: "user1" };
  const conversation1 = { username: "user2" };

  describe("Before login", () => {
    describe("POST /", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).post("/conversations").send(conversation0);
        expect(res.statusCode).toEqual(401);
      });

      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .post("/conversations")
          .set("Authorization", "Bearer BAD")
          .send(conversation0);
        expect(res.statusCode).toEqual(401);
      });
    });
  });

  describe("after login", () => {
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

    describe("POST /", () => {
        it("should send 400 to normal user if username being requested does not exist", async () => {
        const res = await request(server)
          .post("/conversations")
          .set("Authorization", "Bearer " + token0)
          .send(conversation1);
        expect(res.statusCode).toEqual(400);
      });

      it("should send 200 to normal user and create conversation", async () => {
        const res = await request(server)
          .post("/conversations")
          .set("Authorization", "Bearer " + token0)
          .send(conversation0);
        expect(res.statusCode).toEqual(201);
        const storedConversation = await Conversation.findOne().lean();
        expect(storedConversation.userId1.toString()).toEqual(jwt.decode(token0).userId);
        expect(storedConversation.userId2.toString()).toEqual(jwt.decode(token1).userId);
      });
    });

    describe("GET /", () => {
      let conversation0Id, conversation1Id;
      beforeEach(async () => {
        const res0 = await request(server)
          .post("/conversations")
          .set("Authorization", "Bearer " + token0)
          .send(conversation0);
        
        conversation0Id = res0.body._id;
        const res1 = await request(server)
          .post("/conversations")
          .set("Authorization", "Bearer " + token1)
          .send(conversation1);
        conversation1Id = res1.body._id;
      });

      describe("GET /:conversationId", () => {
        it("should send 200 to normal user with conversation matching their conversationId", async () => {
          const res = await request(server)
            .get(`/conversations/${conversation0Id}`)
            .set("Authorization", "Bearer " + token0)
            .send();
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject(
            {
              userId1: jwt.decode(token0).userId,
              userId2: jwt.decode(token1).userId
            }
          );
        });
      });

      describe("GET /byUserId/:userId", () => {
        it("should send 200 to normal user with conversations matching their userId", async () => {
          const userId0 = jwt.decode(token0).userId;
          const res = await request(server)
            .get(`/conversations/byUserId/${userId0}`)
            .set("Authorization", "Bearer " + token0)
            .send();
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject([
            {
              userId1: jwt.decode(token0).userId,
              userId2: jwt.decode(token1).userId
            }
          ]);
        });
      });
    });
  });
});