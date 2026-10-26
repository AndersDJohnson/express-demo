import path from "node:path";
import express from "express";
import { eq } from "drizzle-orm";
import { db, postsTable } from "./db/index.ts";

const port = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Hello, world!");
});

const postsApiRouter = express.Router();

postsApiRouter
  .route("/")
  .get(async (_req, res) => {
    const posts = await db.select().from(postsTable);
    res.send(posts);
  })
  /**
   * Test with:
   * ```sh
   * curl -X POST -H 'content-type: application/json' -d '{"title":"New Post","content":"My content."}' http://localhost:3000/api/posts
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

    // HTML form submissions are sent as application/x-www-form-urlencoded
    if (req.is("application/x-www-form-urlencoded")) {
      res.redirect(`/posts/${id}`);
      return;
    }

    res.send(`Post with ID ${id} created`);
  });

const postsUiRouter = express.Router();

postsUiRouter.route("/").get(async (_req, res) => {
  const posts = await db.select().from(postsTable);
  res.render("posts/index", { posts });
});

postsUiRouter.route("/new").get((_req, res) => {
  res.render("posts/new");
});

postsUiRouter.route("/:id").get(async (req, res) => {
  const posts = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, Number(req.params.id)));

  const post = posts[0];

  if (!post) {
    res.sendStatus(404);
  } else {
    res.render("posts/show", { post });
  }
});

app.use("/api/posts", postsApiRouter);
app.use("/posts", postsUiRouter);

app.get("/health", (_req, res) => {
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
