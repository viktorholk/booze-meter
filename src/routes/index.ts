
import { Router, Request, Response } from "express";

import AuthMiddleware from '../middleware/auth';

import AuthRouter from './auth'
import DatabaseAdapter from '../utils/database-adapter';

import Entry from '../types/entry';

const router = Router();

// Use the AuthMiddleware for the index and profile page
router.get("/", AuthMiddleware, function (req: Request, res: Response) {
  // Get the last 24 hours entries for the user

  DatabaseAdapter.db.all(`
  SELECT * FROM entries 
  WHERE created_at >= datetime('now', '-1 day', 'localtime') 
  AND   created_at <= datetime('now', '+1 day', 'localtime')`,
    (err: any, entries: Entry[]) => {

      if (err) res.send(err);

      console.log(entries)

      res.render("pages/index", { entries, user: res.locals.user });

    })


});

router.get("/profile", AuthMiddleware, function (req, res) {
  res.render("pages/profile");
});

router.use('/auth', AuthRouter)

export default router;
