
import { Router, Request, Response } from "express";

import AuthMiddleware from '../middleware/auth';

import AuthRouter from './auth'
import DatabaseAdapter from '../utils/database-adapter';

import Entry from '../types/entry';
import Item from '../types/item';

const router = Router();

// Use the AuthMiddleware for the index and profile page
router.get("/", AuthMiddleware, function (req: Request, res: Response) {
  // This is Javascript Callback Hell, but it works

  // Get the last 24 hours entries for the user
  // Summerize and group the total amounts within the same hour
  // Order by the dates
  DatabaseAdapter.db.all(`
    SELECT
      strftime('%Y-%m-%d %H:00:00', created_at) AS date,
      SUM(amount) AS total_amount
    FROM
      entries
    WHERE
      created_at >= datetime('now', '-2 day', 'localtime') 
      AND created_at <= datetime('now', '+2 day', 'localtime')
      AND user_id = ?
    GROUP BY
      date 
    ORDER BY
      date ASC`, [res.locals.user.id],
    (err: any, entries: Entry[]) => {
      if (err) return res.send(err);

      DatabaseAdapter.db.all(`
        SELECT * FROM items
      `, (err: any, items: Item[]) => {
        if (err) return res.send(err);

        res.render("pages/index", { entries, items, user: res.locals.user });
      })


    })

});

router.get("/profile", AuthMiddleware, function (req, res) {
  res.render("pages/profile");
});

router.use('/auth', AuthRouter)

export default router;
