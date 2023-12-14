import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import DatabaseAdapter from '../utils/database-adapter';
import _ from 'lodash'

import User from '../types/user';

export default (req: Request, res: Response, next: NextFunction) => {

  const token = req.cookies.token

  // If there is no current token redirect to the login page
  if (!token) return res.redirect('/auth/login');

  // TOKEN SECRET needs to be stored in a variable or else the ts compiler pukes
  const secret = process.env.TOKEN_SECRET;
  if (secret) {
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (decoded) {
        const username = decoded["username"];
        // Get the user from the database and pass it to the locals so we can use it inside the view
        DatabaseAdapter.db.get(`SELECT * FROM users WHERE username = ?`, [username],
          (err, user: User) => {
            if (err) res.sendStatus(500);

            if (user) {
              // Pass the user to the locals but omit the password field
              res.locals.user = _.omit(user, 'password');

              next();
            } else {
              res.redirect('/auth/login');
            }

          });
      } else {

        // Token could not be verified so delete existing cookie
        res.clearCookie('token');
        res.redirect('/auth/login');
      }
    });
  } else res.sendStatus(500);
};