const request = require("supertest");
const app = require("./app");

const chai = require("chai");
const expect = chai.expect;

describe("Testing GET /ping endpoint", function () {
  it("respond with 200 on ping", async function (done) {
    const response = await request(app).get("/ping");
    expect(response.status).toBe(200);
    expect(response.body).toBe();
  });
});
describe("Testing GET /posts endpoint", function () {
  it("respond with 400 when no tag", async function (done) {
    const response = await request(app).get("/posts");
    expect(response.status).toBe(400);
  });
  it("respond with 400 with invalid direction name", async function (done) {
    const response = await request(app).get("/posts?tags=tech&direction=down");
    expect(response.status).toBe(400);
  });
  it("respond with 200 with correct direction name", async function (done) {
    const response = await request(app).get("/posts?tags=tech&direction=desc");
    expect(response.status).toBe(200);
  });
  it("respond with 400 with invalid sortBy name", async function (done) {
    const response = await request(app).get(
      "/posts?tags=tech&sortBy=favoriteFood"
    );
    expect(response.status).toBe(400);
  });
  it("respond with 200 with correct sortBy name", async function (done) {
    const response = await request(app).get("/posts?tags=tech&sortBy=id");
    expect(response.status).toBe(200);
  });
});
