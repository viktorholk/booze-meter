import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction) => {

  const token = req.cookies.token

  // If there is no current token redirect to the login page
  if (!token) return res.redirect('/auth/login');

  // TOKEN SECRET needs to be stored in a variable or else the ts compiler pukes
  const secret = process.env.TOKEN_SECRET;
  if (secret) {
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (decoded) {
        // save the user so it can be used inside the views
        res.locals.user = decoded;
        next();
      } else {
        res.redirect('/auth/login');
      }
    });
  } else res.sendStatus(500);
};