var appRouter = function (app) {
  app.get("/", function (req, res) {
    res.status(200).send("Hello World. This is my restful API");
  });
};

module.exports = appRouter;
