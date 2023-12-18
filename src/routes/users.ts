import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import DatabaseAdapter from '../utils/database-adapter';

import AuthMiddleware from '../middleware/auth';
import User from '../types/user';

const router = Router();
// Update the user
router.post('/', AuthMiddleware, function (req: Request, res: Response) {
  const data = req.body;

  // 2 queries
  // 1 query if the password is filled out and that has to be updated
  // 1 without the password

  if (typeof data.password === 'string' && data.password.length > 0) {
    bcrypt.hash(data.password, 10, function (err, hash) {
      DatabaseAdapter.db.run(
        `
        UPDATE users 
        SET password = ?, weight = ?, gender = ?
        WHERE users.id = ?
      `,
        [hash, data.weight, data.gender, res.locals.user.id],
        (err: any) => {
          if (err) return res.send(err);

          res.redirect('/');
        }
      );
    });
  } else {
    DatabaseAdapter.db.run(
      `
      UPDATE users 
      SET weight = ?, gender = ?
      WHERE users.id = ?
    `,
      [data.weight, data.gender, res.locals.user.id],
      (err: any) => {
        if (err) return res.send(err);

        res.redirect('/');
      }
    );
  }
});

export default router;
