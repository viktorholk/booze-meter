import express, { Express, Request, Response } from "express";

import DatabaseAdapter from "./utils/database-adapter";

DatabaseAdapter.setupSchema();

const app: Express = express();
const port = 3000;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
