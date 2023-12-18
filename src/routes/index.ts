import { Router, Request, Response } from 'express';

import AuthMiddleware from '../middleware/auth';

import AuthRouter from './auth';
import EntriesRouter from './entries';
import DrinksRouter from './drinks';
import UsersRouter from './users';
import DatabaseAdapter from '../utils/database-adapter';

import Entry from '../types/entry';
import Drink from '../types/drink';

const router = Router();

// Use the AuthMiddleware for the index and profile page
router.get('/', AuthMiddleware, function (req: Request, res: Response) {
  // This is Javascript Callback Hell, but it works

  // Get the last 24 hours entries for the user
  // Summerize and group the amounts, of the same drink, within the same hour
  // Order by the dates
  DatabaseAdapter.db.all(
    `
    SELECT 
      drinks.title,
      drinks.volume,
      drinks.alcoholPercentage,
      drinks.barcode,
      SUM(entries.amount) as amount,
      strftime('%Y-%m-%d %H:00:00', entries.created_at) AS date 

    FROM entries
    JOIN drinks ON entries.drink_id = drinks.id

    WHERE
      entries.created_at >= datetime('now', '-1 day', 'localtime') 
      AND entries.created_at <= datetime('now', '+1 day', 'localtime')
      AND user_id = ?
    GROUP BY
        date, entries.drink_id
    ORDER BY
        entries.created_at ASC
    `,
    [res.locals.user.id],
    (err: any, entries: Entry[]) => {
      if (err) return res.send(err.message);

      DatabaseAdapter.db.all(
        `
        SELECT * FROM drinks
      `,
        (err: any, drinks: Drink[]) => {
          if (err) return res.send(err);

          res.render('pages/index', { entries, drinks, user: res.locals.user });
        }
      );
    }
  );
});

router.get('/profile', AuthMiddleware, function (req, res) {
  DatabaseAdapter.db.all(
    `
    SELECT 
    entries.id,
    entries.drink_id,
    entries.amount,
    entries.created_at,
    drinks.title
    
    FROM entries 

    JOIN drinks on entries.drink_id = drinks.id
    WHERE user_id = ?
  `,
    [res.locals.user.id],
    (err: any, entries: Entry[]) => {
      if (err) return res.send(err.message);
      DatabaseAdapter.db.all(
        `
      SELECT * from drinks
      `,
        (err: any, drinks: Drink[]) => {
          if (err) return res.send(err.message);
          res.render('pages/profile', { entries, drinks });
        }
      );
    }
  );
});

router.use('/entries', EntriesRouter);
router.use('/drinks', DrinksRouter);
router.use('/auth', AuthRouter);
router.use('/users', UsersRouter);

export default router;
