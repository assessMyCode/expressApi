const request = require("request");

var appRouter = function (app) {
  app.get("/", function (req, res) {
    res.status(200).send("Hello World. This is my restful API");
  });

  app.get("/ping", function (req, res) {
    res.status(200).send({ success: true });
  });

  app.get("/posts", async function (req, res) {
    const posts = [];

    const tags = req.query.tags;
    if (!tags) {
      return res.status(400).send({ error: "Tags parameter is required" });
    }

    await Promise.all(
      [...tags].map(async (tag) => {
        const hatchResponse = await request(
          `https://api.hatchways.io/assessment/blog/posts?tags=${tag}`
        );
        const hatchPosts = hatchResponse.body
          ? hatchResponse.body.posts
            ? hatchResponse.body.posts
            : "there are no posts with this tag"
          : "there are no posts with that tag";
        if (Array.isArray(hatchPosts)) {
          hatchPosts.forEach((post) => {
            posts.push(post);
          });
        }
      })
    );

    const uniquePosts = [...new Set(posts)];
    let sortedUniquePosts;

    const sortBy = req.query.sortBy;
    const possibleSortBys = ["id", "reads", "likes", "popularity"];
    const direction = req.query.direction;
    const possibleDirections = ["asc", "desc"];
    if (!possibleDirections.includes(direction)) {
      return res.status(400).send({ error: "direction parameter is invalid" });
    }
    if (sortBy) {
      if (!possibleSortBys.includes(sortBy)) {
        return res.status(400).send({ error: "sortBy parameter is invalid" });
      }
      // default sort ascending
      sortedUniquePosts = uniquePosts.sort((a, b) => {
        return a.sortBy - b.sortBy;
      });
      if (direction) {
        if (direction === "desc") {
          sortedUniquePosts = uniquePosts.sort((a, b) => {
            return b.sortBy - a.sortBy;
          });
        }
      }
      return res.status(200).send({ posts: sortedUniquePosts });
    }
  });
};

module.exports = appRouter;
