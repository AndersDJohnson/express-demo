import path from "node:path";
import express from "express";
import { postsUiRouter } from "./routes/posts/ui/index.ts";
import { postsApiRouter } from "./routes/posts/api/index.ts";

const port = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Hello, world!");
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
