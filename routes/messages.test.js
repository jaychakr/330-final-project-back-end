const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const Conversation = require("../models/conversation");
const ChatMessage = require("../models/ChatMessage");

describe("/messages", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const message1 = { message: "This is Message #1" };
  const message2 = { message: "This is Message #2" };

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

    describe("GET /", () => {
      let conversation0Id;

      beforeEach(async () => {
        const res0 = await request(server)
          .post("/conversations")
          .set("Authorization", "Bearer " + token0)
          .send({
            username: jwt.decode(token1).username
          });
        conversation0Id = res0.body._id;
        await ChatMessage.insertMany([
          {
            userId: jwt.decode(token0).userId,
            message: message1.message,
            conversationId: conversation0Id
          },
          {
            userId: jwt.decode(token1).userId,
            message: message2.message,
            conversationId: conversation0Id
          }
        ]);
      });

      afterEach(async() => {
        await ChatMessage.deleteMany();
      });

      it("should send 200 to normal user with all messages", async () => {
        const res = await request(server)
          .get('/messages')
          .set("Authorization", "Bearer " + token0)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject([
          {
            message: "This is Message #1",
          },
          {
            message: "This is Message #2",
          }
        ]);
      });

      describe("GET /:conversationId", () => {
        it("should send 200 to normal user with messages matching the conversation", async () => {
          const res = await request(server)
            .get(`/messages/${conversation0Id}`)
            .set("Authorization", "Bearer " + token0)
            .send();
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject([
            {
              message: "This is Message #1",
            },
            {
              message: "This is Message #2",
            }
          ]);
        });
      });
    });
  });
});