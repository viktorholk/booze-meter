import express, { Express, Request, Response } from "express";
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from "dotenv";

import DatabaseAdapter from './utils/database-adapter';
import Routes from './routes'


// Initialize the environment variables
dotenv.config();

// Setup the sqlite
DatabaseAdapter.setupSchema(false);

const app: Express = express();
const port = 3000;

// Urlencoded allows to post data from forms
app.use(express.urlencoded({ extended: true }));
// Use cookieParser to store the user token in
app.use(cookieParser());


// Setup the static path
app.use(express.static(path.join(__dirname, '/public')))
// EJS Engine
app.set('views', path.join(__dirname, '/views'));
app.set("view engine", "ejs");

app.use('/', Routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
