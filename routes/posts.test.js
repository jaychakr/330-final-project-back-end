const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const Post = require("../models/post");

describe("/posts", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const post0 = { description: "This is Post #1 about apples", fileType: 'image' };
  const post1 = { description: "This is Post #2 about oranges", fileType: 'video' };

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
      it("should send 200 to normal user and create post", async () => {
        const res = await request(server)
          .post("/posts")
          .set("Authorization", "Bearer " + token0)
          .send(post0);
        expect(res.statusCode).toEqual(201);
        const storedPost = await Post.findOne().lean();
        expect(storedPost).toMatchObject({
          description: "This is Post #1 about apples",
          fileType: 'image',
        });
      });
    });

    describe("GET /", () => {
      let post0Id, post1Id;
      beforeEach(async () => {
        const res0 = await request(server)
          .post("/posts")
          .set("Authorization", "Bearer " + token0)
          .send(post0);
        post0Id = res0.body._id;
        const res1 = await request(server)
          .post("/posts")
          .set("Authorization", "Bearer " + token1)
          .send(post1);
        post1Id = res1.body._id;
      });

      it("should send 200 to normal user with their one order", async () => {
        const res = await request(server)
          .get("/posts")
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject([
          {
            description: "This is Post #2 about oranges",
            fileType: 'video'
          },
          {
            description: "This is Post #1 about apples",
            fileType: 'image'
          }
        ]);
      });

      describe("GET /search/:keyword", () => {
        it("should send 200 to normal user with posts matching their keyword", async () => {
          const res = await request(server)
            .get("/posts/search/apples")
            .send();
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject([
            {
              description: "This is Post #1 about apples",
              fileType: 'image'
            }
          ]);
        });
      });

      describe("GET /byUserId/:userId", () => {
        it("should send 200 to normal user with posts matching their userId", async () => {
          const userId0 = jwt.decode(token0).userId;
          const res = await request(server)
            .get(`/posts/byUserId/${userId0}`)
            .send();
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject([
            {
              description: "This is Post #1 about apples",
              fileType: 'image'
            }
          ]);
        });
      });

      describe("GET /byPostId/:postId", () => {
        it("should send 200 to normal user with post matching the postId", async () => {
          const res = await request(server)
            .get(`/posts/byPostId/${post0Id}`)
            .send();
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject(
            {
              description: "This is Post #1 about apples",
              fileType: 'image'
            }
          );
        });
      });

      describe("PUT /byPostId/:postId", () => {
        it("should send 200 to normal user with updated post matching the postId", async () => {
          const res = await request(server)
            .put(`/posts/byPostId/${post0Id}`)
            .set("Authorization", "Bearer " + token0)
            .send({
              description: "This is Post #1 about pineapples"
            });
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject(
            {
              description: "This is Post #1 about pineapples",
              fileType: 'image'
            }
          );
        });
      });

      describe("DELETE /byPostId/:postId", () => {
        it("should send 204 to normal user and delete post matching the postId", async () => {
          const res = await request(server)
            .delete(`/posts/byPostId/${post0Id}`)
            .set("Authorization", "Bearer " + token0)
            .send();
          expect(res.statusCode).toEqual(204);
          const res2 = await request(server)
            .get(`/posts/byPostId/${post0Id}`)
            .send();
          expect(res2.body).toMatchObject({});
        });
      });

    });
  });
});