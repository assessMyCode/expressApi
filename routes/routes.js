const request = require("request");

var appRouter = function (app) {
  app.get("/", function (req, res) {
    res.status(200).send("Hello World. This is my restful API");
  });
  app.get("/ping", async function (req, res) {
    res.status(200).send({ success: true });
  });
  app.get("/posts", async function (req, res) {
    const posts = [];

    const tags = req.query.tags;
    console.log({ tags });
    if (!tags) {
      return res.status(400).send({ error: "Tags parameter is required" });
    }

    tags.forEach(async (tag) => {
      const hatchResponse = await request(
        `https://api.hatchways.io/assessment/blog/posts?tags=${tag}`
      );
      const hatchPosts = hatchResponse.body.posts;
      hatchPosts.forEach((post) => {
        posts.push(post);
      });
    });

    const uniquePosts = [...new Set(posts)];
    let sortedUniquePosts;

    const sortBy = req.query.sortBy;
    const possibleSortBys = ["id", "reads", "likes", "popularity"];
    const direction = req.query.direction;
    const possibleDirections = ["asc", "desc"];
    if (sortBy) {
      if (!possibleSortBys.includes(sortBy)) {
        return res.status(400).send({ error: "sortBy parameter is invalid" });
      }
      if (direction) {
        if (!possibleDirections.includes(direction)) {
          return res
            .status(400)
            .send({ error: "direction parameter is invalid" });
        }
      }
      // default sort ascending
      sortedUniquePosts = uniquePosts.sort((a, b) => {
        return a.sortBy - b.sortBy;
      });
      if (direction === "desc") {
        sortedUniquePosts = uniquePosts.sort((a, b) => {
          return b.sortBy - a.sortBy;
        });
      }
      return res.status(200).send({ posts: sortedUniquePosts });
    }
  });
};

module.exports = appRouter;
