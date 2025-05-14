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
});
