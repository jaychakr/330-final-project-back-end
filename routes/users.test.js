const request = require("supertest");

const app = require("../server");
const testUtils = require("../test-utils");

describe("/order", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  describe("before signup", () => {
    describe("POST /", () => {
      it("should return 401", () => {
        expect(1).toEqual(1);
      });
    });
  });

  test('POST /users/login', async () => {
        await request(app).post('/signup').send({email: 'user0@test.com', username: 'user0', password: 'password'}).expect(201);

        return request(app)
            .post('/login')
            .send({email: 'user0@test.com', username: 'user0', password: 'password'})
            .expect(200);
  });
});
