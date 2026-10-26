import express from "express";
import { db, postsTable } from "../../../db/index.ts";
import { eq } from "drizzle-orm";

export const postsUiRouter = express.Router();

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
