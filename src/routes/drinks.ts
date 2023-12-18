import { Router, Request, Response } from 'express';

import AuthMiddleware from '../middleware/auth';

import DatabaseAdapter from '../utils/database-adapter';

const router = Router();

router.delete('/:drinkId', AuthMiddleware, (req: Request, res: Response) => {
  console.log(req.params);

  DatabaseAdapter.db.run(
    `
    DELETE FROM drinks 
    WHERE id = ?
  `,
    [req.params.drinkId],
    (err: any) => {
      if (!err) {
        res.sendStatus(200);
      }
    }
  );
});

export default router;
