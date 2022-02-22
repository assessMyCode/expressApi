const request = require("request");

var appRouter = function (app) {
  app.get("/", function (req, res) {
    res.status(200).send("Hello World. This is my restful API");
  });
  app.get("/ping", async function (req, res) {
    res.status(200).send({ success: true });
  });
};

module.exports = appRouter;
