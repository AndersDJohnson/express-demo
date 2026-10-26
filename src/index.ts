import express from "express";
import { db, postsTable } from "./db/index.ts";

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const postsRouter = express.Router();

postsRouter
  .route("/")
  .get(async (req, res) => {
    const posts = await db.select().from(postsTable);
    res.send(posts);
  })
  /**
   * Test with:
   * ```sh
   * curl -X POST -H 'content-type: application/json' -d '{"title":"New Post","content":"My content."}' http://localhost:3000/posts
   * ```
   */
  .post(async (req, res) => {
    const inserted = await db
      .insert(postsTable)
      .values({
        title: req.body.title,
        content: req.body.content,
      })
      .returning();

    const id = inserted[0].id;

    res.send(`Post with ID ${id} created`);
  });

app.use("/posts", postsRouter);

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

// Note: Vercel does not actually use this directly.
// It intercepts and rewrites to grab a reference to the app server function.
// It deploys the app as a serverless function rather than a traditional server.
app.listen(port, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
