'use strict';

import { Router } from 'express';
import { RequestHandler } from 'express';
import passport from 'passport';

import csrfProtection from '../middleware/csrf';
import { IUser } from '../types/user';

const router: Router = Router();

// GitHub OAuth login route
router.get(
  '/github',
  csrfProtection as unknown as RequestHandler,
  (req, res, next) => {
    // For Vercel environment, handle OAuth differently if needed
    if (process.env.VERCEL === '1') {
      const csrfToken = req.csrfToken();
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${
        process.env.GITHUB_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        `${process.env.CLIENT_URL}/api/auth/callback/github`
      )}&scope=user:email&state=${csrfToken}`;

      console.log('Redirecting to:', githubAuthUrl);
      return res.redirect(githubAuthUrl);
    }

    // Use passport for non-Vercel environments
    passport.authenticate('github', {
      scope: ['user:email'],
      failureRedirect: '/',
    })(req, res, next);
  }
);

// GitHub OAuth callback route
router.get(
  '/callback/github',
  csrfProtection as unknown as RequestHandler,
  passport.authenticate('github', { failureRedirect: '/' }),
  (_req, res) => {
    // Determine redirect URL based on environment
    let redirectUrl;

    if (process.env.NODE_ENV === 'production') {
      redirectUrl = process.env.PRODUCTION_REDIRECT_URL;
    } else if (process.env.NODE_ENV === 'test') {
      redirectUrl = process.env.TEST_REDIRECT_URL;
    } else {
      redirectUrl = process.env.DEVELOPMENT_REDIRECT_URL;
    }

    // Successful authentication, redirect to appropriate URL
    res.redirect(redirectUrl || '/');
  }
);

// Check authentication status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user as IUser; // Cast req.user to IUser
    res.json({
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email || null,
        name: user.name || null,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      // Get cookie settings from the session configuration
      const cookieOptions = {
        path: '/',
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        domain: 'localhost',
      };

      // Clear the cookie with the same options used when creating it
      res.clearCookie('connect.sid', cookieOptions);

      // Send response after cookie is cleared
      res
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
    });
  });
});

export default router;
