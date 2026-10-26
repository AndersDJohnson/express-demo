import express from "express";
import { db, postsTable } from "./db/index.ts";

const port = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/posts", async (req, res) => {
  const posts = await db.select().from(postsTable);
  res.send(posts);
});

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
