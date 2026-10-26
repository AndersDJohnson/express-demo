import express from "express";
import { db, postsTable } from "../../../db/index.ts";

export const postsApiRouter = express.Router();

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
