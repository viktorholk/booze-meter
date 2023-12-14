import express, { Express, Request, Response } from "express";
import path from 'path';
const app: Express = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/public')))

app.set('views', path.join(__dirname, '/views'));
app.set("view engine", "ejs");

// index page
app.get("/", function (req, res) {
  res.render("pages/index");
});

app.get("/profile", function (req, res) {
  res.render("pages/profile");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
