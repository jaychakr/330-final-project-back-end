const request = require("supertest");
var jwt = require("jsonwebtoken");

const server = require("../server");
const testUtils = require("../test-utils");

const Post = require("../models/post");
const Comment = require("../models/comment");

describe("/comments", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const post0 = { description: "This is Post #1 about apples", fileType: 'image' };
  const comment1 = { description: "This is Comment #1" };
  const comment2 = { description: "This is Comment #2" };

  describe("Before login", () => {
    describe("POST /", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).post("/comments").send(comment1);
        expect(res.statusCode).toEqual(401);
      });

      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .post("/comments")
          .set("Authorization", "Bearer BAD")
          .send(comment1);
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
      it("should send 201 to normal user and create comment", async () => {
        const res = await request(server)
          .post("/posts")
          .set("Authorization", "Bearer " + token0)
          .send(post0);
        expect(res.statusCode).toEqual(201);
        const storedPost = await Post.findOne().lean();
        const res2 = await request(server)
          .post("/comments")
          .set("Authorization", "Bearer " + token0)
          .send({
            postId: storedPost._id,
            description: comment1.description,
          });
        expect(res.statusCode).toEqual(201);
        const storedComment = await Comment.findOne().lean();
        expect(storedComment).toMatchObject({
          postId: storedPost._id,
          description: comment1.description
        });
      });
    });

    describe("GET /", () => {
      let post0Id, comment1Id, comment2Id;
      beforeEach(async () => {
        const res0 = await request(server)
          .post("/posts")
          .set("Authorization", "Bearer " + token0)
          .send(post0);
        post0Id = res0.body._id;
        const res1 = await request(server)
          .post("/comments")
          .set("Authorization", "Bearer " + token0)
          .send({
            postId: post0Id,
            description: comment1.description,
          });
        comment1Id = res1.body._id;
        const res2 = await request(server)
          .post("/comments")
          .set("Authorization", "Bearer " + token0)
          .send({
            postId: post0Id,
            description: comment2.description,
          });
        comment2Id = res2.body._id;
      });

      describe("GET /:postId", () => {
        it("should send 200 to normal user with comments matching the post", async () => {
          const res = await request(server)
            .get(`/comments/${post0Id}`)
            .send();
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject([
            {
              description: "This is Comment #1",
            },
            {
              description: "This is Comment #2",
            }
          ]);
        });
      });

      describe("GET /byCommentId/:commentId", () => {
        it("should send 200 to normal user with comment matching their commentId", async () => {
          const userId0 = jwt.decode(token0).userId;
          const res = await request(server)
            .get(`/comments/byCommentId/${comment1Id}`)
            .send();
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject(
            {
              description: "This is Comment #1"
            }
          );
        });
      });

      describe("PUT /byCommentId/:commentId", () => {
        it("should send 200 to normal user with updated comment matching the commentId", async () => {
          const res = await request(server)
            .put(`/comments/byCommentId/${comment1Id}`)
            .set("Authorization", "Bearer " + token0)
            .send({
              description: "This is Comment #1 (edited)"
            });
          expect(res.statusCode).toEqual(200);
          expect(res.body).toMatchObject(
            {
              description: "This is Comment #1 (edited)",
            }
          );
        });
      });

      describe("DELETE /byCommentId/:commentId", () => {
        it("should send 204 to normal user and delete comment matching the commentId", async () => {
          const res = await request(server)
            .delete(`/comments/byCommentId/${comment1Id}`)
            .set("Authorization", "Bearer " + token0)
            .send();
          expect(res.statusCode).toEqual(204);
          const res2 = await request(server)
            .get(`/comments/bycommentId/${comment1Id}`)
            .send();
          expect(res2.body).toMatchObject({});
        });
      });

    });
  });
});