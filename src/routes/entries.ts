import { Router, Request, Response } from 'express';

import AuthMiddleware from '../middleware/auth';

import DatabaseAdapter from '../utils/database-adapter';

import moment, { Moment } from 'moment';
import Drink from '../types/drink';

const createEntry = (userId: number, drinkId: number, amount: number, date: Moment) => {
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

  const date = moment(moment(data.datetimePicker));

  // If advanced check we will create the entry, but also add the drink to the database so it can be selected next time
  if (data.advancedCheck !== 'on') {
    createEntry(userId, data.drinkId, data.amount, date);
    res.redirect('/');
  } else {
    const title = data.advancedTitle;

    const volume = Number(data.advancedVolume);
    const alcoholPercentage = parseFloat(data.advancedAlcoholProcentage);
    const barcode = data.advancedBarcode.length > 0 ? data.advancedBarcode : null;
    const amount = Number(data.advancedAmount);

    if (title.length == 0) return res.status(400).send('Missing title');
    if (!alcoholPercentage) return res.status(400).send('Missing alcohol percentage');
    if (!volume) return res.status(400).send('Missing volume');

    if (volume && alcoholPercentage && amount) {
      DatabaseAdapter.db.get(
        `
        SELECT * FROM drinks
        WHERE title = ?
      `,
        [title],
        (err: any, row: Drink) => {
          // If the drink already exists update it create new
          if (row) {
            DatabaseAdapter.db.run(
              `
            UPDATE drinks 
            volume = ?, alcoholPercentage = ?, barcode = ?
            WHERE title = ?
          `,
              [volume, alcoholPercentage, barcode, title],
              function (err: any) {
                if (err) return res.status(400).send(err.message);
                createEntry(userId, row.id, amount, date);
                res.redirect('/');
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
                if (err) return res.status(400).send(err.message);

                if (this.lastID) {
                  createEntry(userId, this.lastID, amount, date);
                  res.redirect('/');
                }
              }
            );
          }
        }
      );
    }
  }
});

router.delete('/:entryId', AuthMiddleware, (req: Request, res: Response) => {
  DatabaseAdapter.db.run(
    `
    DELETE FROM entries
    WHERE id = ?
  `,
    [req.params.entryId],
    (err: any) => {
      if (!err) {
        res.sendStatus(200);
      }
    }
  );
});

export default router;
