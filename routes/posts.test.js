const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const Post = require("../models/post");

describe("/posts", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const post0 = { description: "This is Post #1", fileType: 'image' };
  const post1 = { description: "This is Post #2", fileType: 'video' };

  describe("Before login", () => {
    describe("POST /", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).post("/posts").send(post0);
        expect(res.statusCode).toEqual(401);
      });

      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .post("/posts")
          .set("Authorization", "Bearer BAD")
          .send(post0);
        expect(res.statusCode).toEqual(401);
      });
    });
  });
});