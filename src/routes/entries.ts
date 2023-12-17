import { Router, Request, Response } from 'express';

import AuthMiddleware from '../middleware/auth';

import DatabaseAdapter from '../utils/database-adapter';

import moment, { Moment } from 'moment';
import Drink from '../types/drink';

const createEntry = (userId: number, drinkId: number, amount: number, date: Moment) => {
  console.log(date.format('YY-MM-DD HH-mm'));
  DatabaseAdapter.db.run(
    `
    INSERT INTO entries
    (user_id, drink_id, amount, created_at) VALUES(?,?,?, ?) 
  `,
    [userId, drinkId, amount, date.format('YYYY-MM-DD HH:mm')]
  );
};

const router = Router();

// Create new entry
router.post('/', AuthMiddleware, function (req: Request, res: Response) {
  const userId = res.locals.user.id;

  const data = req.body;

  const date = moment(Number(data.timePicker.replace(':', '')), 'HHmm');

  // If advanced check we will create the entry, but also add the drink to the database so it can be selected next time
  if (data.advancedCheck !== 'on') {
    createEntry(userId, data.drinkId, data.amount, date);
  } else {
    const title = data.advancedTitle;

    const volume = Number(data.advancedVolume);
    const alcoholPercentage = parseFloat(data.advancedAlcoholProcentage);
    const barcode = data.advancedBarcode;
    const amount = Number(data.advancedAmount);

    DatabaseAdapter.db.get(
      `
      SELECT * FROM drinks
      WHERE title = ?
    `,
      [title],
      (err: any, row: Drink) => {
        let id = null;

        // If the drink already exists update it create new
        if (row) {
          DatabaseAdapter.db.run(
            `
          UPDATE drinks 
          volume = ?, alcoholPercentage = ?, barcode = ?
          WHERE title = ?
        `,
            [volume, alcoholPercentage, barcode, title],
            function (err) {
              createEntry(userId, row.id, amount, date);
            }
          );
        } else {
          DatabaseAdapter.db.run(
            `
          INSERT INTO drinks 
          (title, volume, alcoholPercentage, barcode)
          VALUES
          (?,?,?,?)
        `,
            [title, volume, alcoholPercentage, barcode],
            function (err: any) {
              createEntry(userId, this.lastID, amount, date);
            }
          );
        }
      }
    );
  }

  res.redirect('/');
});

export default router;
