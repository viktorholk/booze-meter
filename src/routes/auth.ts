import { Router, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import DatabaseAdapter from '../utils/database-adapter';
import User from '../types/user';

const router = Router();
function generateToken(user: User) {
  const secret = process.env.TOKEN_SECRET;

  if (secret) return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '24h' });
}

router.get('/logout', function (req: Request, res: Response) {
  // Reset user and redirect to login page
  res.clearCookie('token').redirect('/auth/login');
});

router.get('/login', function (req: Request, res: Response) {
  // Make sure the token has been cleared so we dont create a redirect chain
  res.clearCookie('token').render('pages/auth/login');
});

router.post('/login', function (req: Request, res: Response) {
  const username = req.body['username'].toLowerCase();
  const password = req.body['password'];

  if (!username) return res.render('pages/auth/login', { message: 'Username is required' });
  if (!password) return res.render('pages/auth/login', { message: 'Password is required' });

  DatabaseAdapter.db.get('SELECT * from users WHERE username = ?', [username], (err, row: User) => {
    if (err) res.sendStatus(500);

    if (row) {
      bcrypt.compare(password, row.password, (_, result) => {
        const token = generateToken(row);
        if (result)
          res
            .cookie('token', token, {
              httpOnly: true
            })
            .redirect('/');
        else res.render('pages/auth/login', { message: 'Incorrect username or password' });
      });
    } else res.render('pages/auth/login', { message: 'Incorrect username or password' });
  });
});

router.get('/register', function (req: Request, res: Response) {
  res.clearCookie('token').render('pages/auth/register');
});

router.post('/register', function (req: Request, res: Response) {
  const username = req.body['username'].toLowerCase();
  const password = req.body['password'];
  const password2 = req.body['password2'];

  if (!username) return res.render('pages/auth/register', { message: 'Username is required' });
  if (!password) return res.render('pages/auth/register', { message: 'Password is required' });

  if (password !== password2)
    return res.render('pages/auth/register', { message: 'Password does not match confirmation' });

  DatabaseAdapter.db.get(`SELECT username FROM users WHERE username = ?`, [username], (err, row: User) => {
    if (err) res.sendStatus(500);

    if (row) {
      return res.render('pages/auth/register', { message: 'username already exists' });
    } else {
      bcrypt.hash(password, 10, function (err, hash) {
        if (hash) {
          DatabaseAdapter.db.run(
            `INSERT INTO users (username, password) VALUES(?, ?)`,
            [username, hash],
            function (err) {
              const newUser: User = {
                id: this.lastID,
                username: username,
                password: hash
              };
              const token = generateToken(newUser);
              return res
                .cookie('token', token, {
                  httpOnly: true
                })
                .redirect('/');
            }
          );
        } else res.sendStatus(500);
      });
    }
  });
});

export default router;
